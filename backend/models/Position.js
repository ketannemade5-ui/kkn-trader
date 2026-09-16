const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  side: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true,
  },
  orderType: {
    type: String,
    enum: ['MARKET', 'LIMIT', 'STOP'],
    default: 'MARKET',
  },
  lots: {
    type: Number,
    required: true,
    min: 0.01,
  },
  units: {
    type: Number,
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  stopLoss: {
    type: Number,
    default: null,
  },
  takeProfit: {
    type: Number,
    default: null,
  },
  marginRequired: {
    type: Number,
    default: 0,
  },
  unrealizedPL: {
    type: Number,
    default: 0,
  },
  unrealizedPLPercent: {
    type: Number,
    default: 0,
  },
  riskRewardRatio: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['OPEN', 'PENDING', 'CLOSED', 'CANCELLED'],
    default: 'OPEN',
  },
  strategySetup: {
    type: String,
    default: 'Price Action & Liquidity Sweep',
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Position', positionSchema);
