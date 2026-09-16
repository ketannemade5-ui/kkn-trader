const { getQuotes, getQuoteBySymbol, generateOHLCV } = require('../services/marketDataService');
const Watchlist = require('../models/Watchlist');
const mongoose = require('mongoose');

// @desc   Get all market instrument quotes (Forex, Metals, Indices, Crypto, Commodities)
// @route  GET /api/markets/quotes
// @access Public
const getMarketQuotes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const quotes = getQuotes(category);
    res.status(200).json({
      success: true,
      dataMode: 'Near Real-Time Simulation & Market Stream (DEMO DATA)',
      count: quotes.length,
      data: quotes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single instrument quote by symbol
// @route  GET /api/markets/quote/:symbol
// @access Public
const getSingleQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const quote = getQuoteBySymbol(symbol);
    if (!quote) {
      return res.status(404).json({ success: false, message: `Instrument not found: ${symbol}` });
    }
    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get historical candlestick OHLCV data for charts
// @route  GET /api/markets/history/:symbol
// @access Public
const getMarketHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1H', limit = 150 } = req.query;
    
    const cleanSymbol = symbol.replace('-', '/');
    const result = await generateOHLCV(cleanSymbol, timeframe, parseInt(limit, 10));
    const candles = Array.isArray(result) ? result : result.candles;
    const isLiveFeed = result.isLiveFeed || false;

    res.status(200).json({
      success: true,
      symbol: cleanSymbol,
      timeframe,
      isLiveFeed,
      count: candles.length,
      data: candles,
    });
  } catch (err) {
    next(err);
  }
};

const USER_WATCHLIST_MAP = new Map();

// @desc   Get user's personal watchlist
// @route  GET /api/markets/watchlist
// @access Private
const getUserWatchlist = async (req, res, next) => {
  try {
    const userId = req.user?.uid || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to view watchlist.' });
    }

    const defaultSymbols = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30'];
    let symbols = defaultSymbols;

    if (mongoose.connection.readyState === 1) {
      try {
        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
          watchlist = await Watchlist.create({
            userId,
            symbols: defaultSymbols,
          });
        }
        symbols = watchlist.symbols;
      } catch (e) {
        if (!USER_WATCHLIST_MAP.has(String(userId))) {
          USER_WATCHLIST_MAP.set(String(userId), [...defaultSymbols]);
        }
        symbols = USER_WATCHLIST_MAP.get(String(userId));
      }
    } else {
      if (!USER_WATCHLIST_MAP.has(String(userId))) {
        USER_WATCHLIST_MAP.set(String(userId), [...defaultSymbols]);
      }
      symbols = USER_WATCHLIST_MAP.get(String(userId));
    }

    const items = symbols.map(sym => getQuoteBySymbol(sym)).filter(Boolean);

    res.status(200).json({
      success: true,
      symbols,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle symbol in user's watchlist (Add/Remove)
// @route  POST /api/markets/watchlist/toggle
// @access Private
const toggleWatchlistSymbol = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const userId = req.user?.uid || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to modify watchlist.' });
    }

    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    const cleanSymbol = symbol.toUpperCase().replace('-', '/');
    let symbols = [];
    let action = 'added';

    if (mongoose.connection.readyState === 1) {
      try {
        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
          watchlist = await Watchlist.create({ userId, symbols: [] });
        }

        const index = watchlist.symbols.indexOf(cleanSymbol);
        if (index > -1) {
          watchlist.symbols.splice(index, 1);
          action = 'removed';
        } else {
          watchlist.symbols.push(cleanSymbol);
        }

        await watchlist.save();
        symbols = watchlist.symbols;
      } catch (e) {
        // memory fallback
        if (!USER_WATCHLIST_MAP.has(String(userId))) {
          USER_WATCHLIST_MAP.set(String(userId), ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30']);
        }
        const userSymbols = USER_WATCHLIST_MAP.get(String(userId));
        const index = userSymbols.indexOf(cleanSymbol);
        if (index > -1) {
          userSymbols.splice(index, 1);
          action = 'removed';
        } else {
          userSymbols.push(cleanSymbol);
        }
        symbols = userSymbols;
      }
    } else {
      if (!USER_WATCHLIST_MAP.has(String(userId))) {
        USER_WATCHLIST_MAP.set(String(userId), ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30']);
      }
      const userSymbols = USER_WATCHLIST_MAP.get(String(userId));
      const index = userSymbols.indexOf(cleanSymbol);
      if (index > -1) {
        userSymbols.splice(index, 1);
        action = 'removed';
      } else {
        userSymbols.push(cleanSymbol);
      }
      symbols = userSymbols;
    }

    res.status(200).json({
      success: true,
      action,
      symbols,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMarketQuotes,
  getSingleQuote,
  getMarketHistory,
  getUserWatchlist,
  toggleWatchlistSymbol,
};
