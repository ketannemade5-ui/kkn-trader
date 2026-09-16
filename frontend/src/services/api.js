import axios from 'axios';
import { auth } from '../config/firebase';

// Dynamically resolve API Base URL from environment variable or fallback to /api
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to append fresh Firebase ID token or stored token
API.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch the latest valid Firebase ID token (auto-refreshes if expired)
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
        try {
          localStorage.setItem('kkn_token', idToken);
        } catch (e) {}
      } else {
        const storedToken = localStorage.getItem('kkn_token');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      }
    } catch (err) {
      const storedToken = localStorage.getItem('kkn_token');
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    if (error.response?.status === 401) {
      // Avoid clearing local session if on login, register, or initial load where Firebase is initializing
      const isAuthPage = typeof window !== 'undefined' && 
        (window.location.pathname.includes('/login') || window.location.pathname.includes('/register'));
      if (!isAuthPage && !auth.currentUser) {
        localStorage.removeItem('kkn_token');
        localStorage.removeItem('kkn_user');
      }
    }
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  firebaseSync: (data) => API.post('/auth/firebase-sync', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Course & Academy API
export const courseAPI = {
  getCourses: () => API.get('/courses'),
  getCourseBySlug: (slug) => API.get(`/courses/${slug}`),
  getLesson: (courseSlug, lessonSlug) => API.get(`/courses/${courseSlug}/${lessonSlug}`),
  markCompleted: (courseSlug, lessonSlug) => API.post('/courses/complete-lesson', { courseSlug, lessonSlug }),
};

// Quiz API
export const quizAPI = {
  getQuiz: (courseSlug) => API.get(`/quizzes/${courseSlug}`),
  submitQuiz: (courseSlug, answers) => API.post(`/quizzes/${courseSlug}/submit`, { answers }),
};

// Market Data API
export const marketAPI = {
  getQuotes: (category) => API.get('/markets/quotes', { params: { category } }),
  getQuote: (symbol) => API.get(`/markets/quote/${encodeURIComponent(symbol)}`),
  getHistory: (symbol, timeframe = '1H', limit = 100) => API.get(`/markets/history/${encodeURIComponent(symbol)}`, { params: { timeframe, limit } }),
  getWatchlist: () => API.get('/markets/watchlist'),
  toggleWatchlist: (symbol) => API.post('/markets/watchlist/toggle', { symbol }),
};

// Paper Trading API
export const paperTradingAPI = {
  placeOrder: (data) => API.post('/paper-trading/order', data),
  getPositions: () => API.get('/paper-trading/positions'),
  getPendingOrders: () => API.get('/paper-trading/pending-orders'),
  closePosition: (positionId) => API.post('/paper-trading/close', { positionId }),
  updateLimits: (id, limits) => API.put(`/paper-trading/position/${id}`, limits),
  getHistory: () => API.get('/paper-trading/history'),
  resetAccount: () => API.post('/paper-trading/reset'),
};

// Portfolio API
export const portfolioAPI = {
  getSummary: () => API.get('/portfolio/summary'),
};

// Journal API
export const journalAPI = {
  getEntries: (filters) => API.get('/journal', { params: filters }),
  createEntry: (data) => API.post('/journal', data),
  updateEntry: (id, data) => API.put(`/journal/${id}`, data),
  deleteEntry: (id) => API.delete(`/journal/${id}`),
};

// Gemini Direct Client Fallback (Guarantees real-time dynamic answers even if remote backend is sleeping or offline)
const askGeminiDirect = async (prompt, apiKey) => {
  const systemPrompt = `You are KKN AI, an institutional trading education assistant for KKN TRADER.
Explain trading concepts clearly with strict risk management.
Always return ONLY valid JSON with keys: title, summary, simpleExplanation, detailedExplanation, realMarketExample, keyPoints (array of strings), disclaimer.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No content returned from Gemini');
  const parsed = JSON.parse(rawText);

  return {
    success: true,
    provider: 'gemini',
    response: {
      title: parsed.title || `Understanding "${prompt}"`,
      summary: parsed.summary || '',
      simpleExplanation: parsed.simpleExplanation || '',
      detailedExplanation: parsed.detailedExplanation || '',
      realMarketExample: parsed.realMarketExample || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      disclaimer: parsed.disclaimer || 'DISCLAIMER: KKN AI is strictly an educational learning tool.',
    },
    suggestedQuestions: [
      'What is liquidity and how do institutions use it?',
      'Explain the difference between BOS and CHoCH.',
      'How does an Order Block form?',
      'What is a Fair Value Gap (FVG)?',
      'What are the core rules of 1% Risk Management?',
      'Give me a step-by-step beginner trading roadmap.'
    ],
    createdAt: new Date().toISOString(),
  };
};

// AI Assistant API
export const aiAPI = {
  ask: async (prompt, context) => {
    const clientGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      // Race backend with a 5-second timeout in case remote Render instance is sleeping
      const backendPromise = API.post('/ai/ask', { prompt, context });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Backend latency timeout')), 5000)
      );
      const res = await Promise.race([backendPromise, timeoutPromise]);
      if (res && res.provider === 'gemini') {
        return res;
      }
      if (clientGeminiKey) {
        return await askGeminiDirect(prompt, clientGeminiKey);
      }
      return res;
    } catch (err) {
      if (clientGeminiKey) {
        return await askGeminiDirect(prompt, clientGeminiKey);
      }
      throw err;
    }
  },
};

// Tools & Calculator API
export const toolAPI = {
  calcPositionSize: (data) => API.post('/tools/position-size', data),
  calcRiskReward: (data) => API.post('/tools/risk-reward', data),
  calcCompounding: (data) => API.post('/tools/compounding', data),
};

// Blog API
export const blogAPI = {
  getPosts: (params) => API.get('/blog', { params }),
  getPostBySlug: (slug) => API.get(`/blog/${slug}`),
};

// Backtesting API
export const backtestAPI = {
  getSession: (params) => API.get('/backtest/session', { params }),
};

// Admin API
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/status`),
  saveCourse: (data) => API.post('/admin/courses', data),
  saveBlog: (data) => API.post('/admin/blogs', data),
  deleteBlog: (id) => API.delete(`/admin/blogs/${id}`),
};

export default API;
