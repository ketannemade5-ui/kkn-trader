const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryFallback = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kkntrader';
  const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas || process.env.NODE_ENV === 'production' ? 10000 : 2500,
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`[Database] MongoDB Connected successfully to: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`[Database] Database connection note (${err.message}). Using resilient in-memory store fallback.`);
    isInMemoryFallback = true;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  inMemoryFallback: isInMemoryFallback,
  host: mongoose.connection.host || 'embedded-memory-store',
});

module.exports = { connectDB, getDBStatus };
