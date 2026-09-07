const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { seedDatabase } = require('./services/seedService');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Reverse proxy support (Render, Cloudflare, etc.)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration - Supports production domains, Vercel deployments, and development
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://kkntrader.com',
  'https://www.kkntrader.com',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = 
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('kkntrader.com');

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'KKN TRADER API',
    status: 'ACTIVE',
    version: '1.0.0',
    brand: 'KKN TRADER',
    officialDomain: 'https://kkntrader.com',
    healthCheck: '/api/health',
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'ONLINE',
    brand: 'KKN TRADER',
    domain: 'kkntrader.com',
    tagline: 'Learn the Market. Practice the Trade. Master the Skill.',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/courseRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/markets', require('./routes/marketRoutes'));
app.use('/api/paper-trading', require('./routes/paperTradingRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/tools', require('./routes/toolRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/backtest', require('./routes/backtestRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ KKN TRADER Institutional Server Online`);
    console.log(`🚀 Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Official Domain: kkntrader.com`);
    console.log(`======================================================\n`);
  });
};

startServer();
