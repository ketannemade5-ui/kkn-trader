const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  initialBalance: {
    type: Number,
    default: 100000.00,
  },
  virtualBalance: {
    type: Number,
    default: 100000.00,
  },
  equity: {
    type: Number,
    default: 100000.00,
  },
  usedMargin: {
    type: Number,
    default: 0.00,
  },
  availableMargin: {
    type: Number,
    default: 100000.00,
  },
  totalRealizedPL: {
    type: Number,
    default: 0.00,
  },
  todayRealizedPL: {
    type: Number,
    default: 0.00,
  },
  totalTrades: {
    type: Number,
    default: 0,
  },
  winningTrades: {
    type: Number,
    default: 0,
  },
  losingTrades: {
    type: Number,
    default: 0,
  },
  winRate: {
    type: Number,
    default: 0.00,
  },
  maxDrawdownPercent: {
    type: Number,
    default: 0.00,
  },
  equityHistory: [{
    timestamp: { type: Date, default: Date.now },
    balance: Number,
    equity: Number,
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
