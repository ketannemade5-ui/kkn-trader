const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true,
  },
  tradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
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
  entryPrice: {
    type: Number,
    required: true,
  },
  exitPrice: {
    type: Number,
    required: true,
  },
  stopLoss: Number,
  takeProfit: Number,
  lots: Number,
  realizedPL: {
    type: Number,
    required: true,
  },
  riskReward: Number,
  result: {
    type: String,
    enum: ['WIN', 'LOSS', 'BREAKEVEN'],
    required: true,
  },
  strategySetup: {
    type: String,
    default: 'Market Structure & Liquidity',
  },
  tradeReason: {
    type: String,
    default: '',
  },
  emotion: {
    type: String,
    enum: ['Calm & Disciplined', 'Confident', 'Hesitant', 'FOMO', 'Impulsive', 'Greedy', 'Anxious', 'Revenge Trade'],
    default: 'Calm & Disciplined',
  },
  mistake: {
    type: String,
    default: 'None - Followed Rules',
  },
  lessonLearned: {
    type: String,
    default: '',
  },
  screenshotUrl: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
