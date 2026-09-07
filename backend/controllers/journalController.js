const JournalEntry = require('../models/JournalEntry');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

let MEMORY_JOURNAL = [
  {
    _id: 'journal_1',
    symbol: 'XAU/USD',
    side: 'BUY',
    entryPrice: 2380.00,
    exitPrice: 2394.50,
    lots: 1.0,
    realizedPL: 1450.00,
    result: 'WIN',
    strategySetup: 'Liquidity Sweep + 15m Bullish FVG',
    tradeReason: 'Asian low swept with strong displacement candle closing above previous 15m high (CHoCH).',
    emotion: 'Calm & Disciplined',
    mistake: 'None - Followed Rules',
    lessonLearned: 'Patience for liquidity pool sweep produces highest R:R setups.',
    date: new Date(),
  },
  {
    _id: 'journal_2',
    symbol: 'EUR/USD',
    side: 'BUY',
    entryPrice: 1.0840,
    exitPrice: 1.0880,
    lots: 0.5,
    realizedPL: 200.00,
    result: 'WIN',
    strategySetup: 'London Killzone Order Block Retest',
    tradeReason: 'Price retested fresh 1-hour bullish order block during London open volume expansion.',
    emotion: 'Confident',
    mistake: 'None - Followed Rules',
    lessonLearned: 'Aligning with London session killzone timing creates immediate momentum.',
    date: new Date(Date.now() - 86400000),
  }
];

// @desc   Get user's trade journal entries with optional filters
// @route  GET /api/journal
// @access Private
const getJournalEntries = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { symbol, result, emotion, setup } = req.query;

    if (isDbConnected()) {
      try {
        const query = { userId };
        if (symbol) query.symbol = symbol.toUpperCase();
        if (result) query.result = result.toUpperCase();
        if (emotion) query.emotion = emotion;
        if (setup) query.strategySetup = setup;

        const entries = await JournalEntry.find(query).sort({ date: -1 });
        return res.status(200).json({ success: true, count: entries.length, data: entries });
      } catch (e) {
        // fallback
      }
    }

    let filtered = [...MEMORY_JOURNAL];
    if (symbol) filtered = filtered.filter(e => e.symbol.toUpperCase() === symbol.toUpperCase());
    if (result && result !== 'All') filtered = filtered.filter(e => e.result.toUpperCase() === result.toUpperCase());

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create manual journal entry or note
// @route  POST /api/journal
// @access Private
const createJournalEntry = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    const {
      symbol,
      side,
      entryPrice,
      exitPrice,
      lots,
      realizedPL,
      result,
      strategySetup,
      tradeReason,
      emotion,
      mistake,
      lessonLearned,
    } = req.body;

    const calculatedPL = realizedPL !== undefined ? parseFloat(realizedPL) : ((parseFloat(exitPrice) - parseFloat(entryPrice)) * (lots || 1) * 100);
    const calculatedResult = result || (calculatedPL > 0 ? 'WIN' : calculatedPL < 0 ? 'LOSS' : 'BREAKEVEN');

    const newEntry = {
      _id: `journal_${Date.now()}`,
      userId,
      symbol: symbol ? symbol.toUpperCase() : 'XAU/USD',
      side: side ? side.toUpperCase() : 'BUY',
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      lots: lots ? parseFloat(lots) : 1.0,
      realizedPL: calculatedPL,
      result: calculatedResult,
      strategySetup: strategySetup || 'Market Structure',
      tradeReason: tradeReason || '',
      emotion: emotion || 'Calm & Disciplined',
      mistake: mistake || 'None',
      lessonLearned: lessonLearned || '',
      date: new Date(),
    };

    if (isDbConnected()) {
      try {
        await JournalEntry.create(newEntry);
      } catch (e) {
        // fallback
      }
    }

    MEMORY_JOURNAL.unshift(newEntry);

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update trade journal entry
// @route  PUT /api/journal/:id
// @access Private
const updateJournalEntry = async (req, res, next) => {
  try {
    const entry = MEMORY_JOURNAL.find(e => e._id === req.params.id);
    if (entry) {
      Object.assign(entry, req.body);
    }
    res.status(200).json({ success: true, message: 'Journal entry updated', data: entry });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete journal entry
// @route  DELETE /api/journal/:id
// @access Private
const deleteJournalEntry = async (req, res, next) => {
  try {
    MEMORY_JOURNAL = MEMORY_JOURNAL.filter(e => e._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
};
