const JournalEntry = require('../models/JournalEntry');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

const getUserId = (req) => req.user?.uid || req.user?.id || req.user?._id;

const USER_JOURNAL_MAP = new Map();

const getUserJournal = (userId) => {
  const uid = String(userId);
  if (!USER_JOURNAL_MAP.has(uid)) {
    USER_JOURNAL_MAP.set(uid, []);
  }
  return USER_JOURNAL_MAP.get(uid);
};

// @desc   Get authenticated user's trade journal entries with optional filters
// @route  GET /api/journal
// @access Private (Requires Auth)
const getJournalEntries = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to view journal.' });
    }

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

    const userJournal = getUserJournal(userId);
    let filtered = [...userJournal];
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

// @desc   Create manual journal entry for authenticated user
// @route  POST /api/journal
// @access Private (Requires Auth)
const createJournalEntry = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to create journal entry.' });
    }

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
      _id: `journal_${Date.now()}_${Math.random().toString(36).slice(-5)}`,
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

    const userJournal = getUserJournal(userId);
    userJournal.unshift(newEntry);

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update trade journal entry for authenticated user
// @route  PUT /api/journal/:id
// @access Private (Requires Auth)
const updateJournalEntry = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to update journal entry.' });
    }

    if (isDbConnected()) {
      try {
        const updated = await JournalEntry.findOneAndUpdate(
          { _id: req.params.id, userId },
          req.body,
          { new: true }
        );
        if (updated) {
          return res.status(200).json({ success: true, message: 'Journal entry updated', data: updated });
        }
      } catch (e) {}
    }

    const userJournal = getUserJournal(userId);
    const entry = userJournal.find(e => e._id === req.params.id && e.userId === userId);
    if (entry) {
      Object.assign(entry, req.body);
      return res.status(200).json({ success: true, message: 'Journal entry updated', data: entry });
    }

    res.status(404).json({ success: false, message: 'Journal entry not found' });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete authenticated user's journal entry
// @route  DELETE /api/journal/:id
// @access Private (Requires Auth)
const deleteJournalEntry = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to delete journal entry.' });
    }

    if (isDbConnected()) {
      try {
        await JournalEntry.findOneAndDelete({ _id: req.params.id, userId });
      } catch (e) {}
    }

    const userJournal = getUserJournal(userId);
    const filtered = userJournal.filter(e => e._id !== req.params.id);
    USER_JOURNAL_MAP.set(String(userId), filtered);

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
