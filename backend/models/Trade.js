const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true,
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
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
  lots: {
    type: Number,
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
  risk: {
    type: Number,
    default: 0,
  },
  reward: {
    type: Number,
    default: 0,
  },
  riskRewardRatio: {
    type: Number,
    default: 0,
  },
  realizedPL: {
    type: Number,
    required: true,
  },
  realizedPLPercent: {
    type: Number,
    required: true,
  },
  riskRewardAchieved: {
    type: Number,
    default: 0,
  },
  result: {
    type: String,
    enum: ['WIN', 'LOSS', 'BREAKEVEN'],
    required: true,
  },
  tradeStatus: {
    type: String,
    default: 'CLOSED',
  },
  closeReason: {
    type: String,
    enum: ['MANUAL', 'TAKE_PROFIT', 'STOP_LOSS', 'MARGIN_CALL'],
    default: 'MANUAL',
  },
  openedAt: {
    type: Date,
    required: true,
  },
  closedAt: {
    type: Date,
    default: Date.now,
  },
  strategySetup: {
    type: String,
    default: 'Price Action & Key Levels',
  },
  journalEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JournalEntry',
  },
});

module.exports = mongoose.model('Trade', tradeSchema);
