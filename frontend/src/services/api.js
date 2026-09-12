import axios from 'axios';

// Dynamically resolve API Base URL from environment variable or fallback to /api
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to append JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kkn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Don't auto-redirect on login or register endpoints
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
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

// AI Assistant API
export const aiAPI = {
  ask: (prompt, context) => API.post('/ai/ask', { prompt, context }),
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
