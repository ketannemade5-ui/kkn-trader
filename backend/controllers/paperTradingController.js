const Position = require('../models/Position');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');
const { openPosition, closePosition } = require('../services/paperTradingService');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory paper trading state fallback
let MEMORY_POSITIONS = [];
let MEMORY_TRADES = [];
let MEMORY_PORTFOLIO = {
  balance: 100000.00,
  equity: 100000.00,
  usedMargin: 0.00,
  availableMargin: 100000.00,
  floatingPL: 0.00,
  realizedPL: 0.00,
  todayPL: 0.00,
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
  winRate: 0.00,
  equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
};

// @desc   Execute virtual paper trading order (BUY / SELL)
// @route  POST /api/paper-trading/order
// @access Private
const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    const { symbol, side, orderType = 'MARKET', lots, stopLoss, takeProfit, strategySetup } = req.body;

    if (!symbol || !side || !lots) {
      return res.status(400).json({ success: false, message: 'Please provide symbol, side (BUY/SELL), and lot size.' });
    }

    if (isDbConnected()) {
      try {
        const position = await openPosition(userId, {
          symbol: symbol.toUpperCase().replace('-', '/'),
          side: side.toUpperCase(),
          orderType,
          lots: parseFloat(lots),
          stopLoss: stopLoss ? parseFloat(stopLoss) : null,
          takeProfit: takeProfit ? parseFloat(takeProfit) : null,
          strategySetup,
        });

        return res.status(201).json({
          success: true,
          message: `Virtual ${position.side} order for ${position.lots} lot(s) of ${position.symbol} executed successfully.`,
          data: position,
        });
      } catch (e) {
        // fallback
      }
    }

    // In-memory execution
    const { getQuoteBySymbol } = require('../services/marketDataService');
    const quote = getQuoteBySymbol(symbol) || { price: 2385.40, bid: 2385.25, ask: 2385.55, digits: 2 };
    const execPrice = side.toUpperCase() === 'BUY' ? quote.ask : quote.bid;
    const units = parseFloat(lots) * (quote.category === 'Forex' ? 100000 : 100);
    const marginReq = Number(((units * execPrice) / 100).toFixed(2));

    const newPos = {
      _id: `pos_${Date.now()}`,
      userId,
      symbol: symbol.toUpperCase().replace('-', '/'),
      side: side.toUpperCase(),
      orderType,
      lots: parseFloat(lots),
      units,
      entryPrice: execPrice,
      currentPrice: execPrice,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      marginRequired: marginReq,
      unrealizedPL: 0.00,
      unrealizedPLPercent: 0.00,
      status: 'OPEN',
      openedAt: new Date(),
    };

    MEMORY_POSITIONS.unshift(newPos);
    MEMORY_PORTFOLIO.usedMargin = Number((MEMORY_PORTFOLIO.usedMargin + marginReq).toFixed(2));
    MEMORY_PORTFOLIO.availableMargin = Number((MEMORY_PORTFOLIO.balance - MEMORY_PORTFOLIO.usedMargin).toFixed(2));

    res.status(201).json({
      success: true,
      message: `Virtual ${newPos.side} order for ${newPos.lots} lot(s) of ${newPos.symbol} executed successfully.`,
      data: newPos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get user's open and pending positions
// @route  GET /api/paper-trading/positions
// @access Private
const getPositions = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    let positions = [];
    let pending = [];

    if (isDbConnected()) {
      try {
        positions = await Position.find({ userId, status: 'OPEN' }).sort({ openedAt: -1 });
        pending = await Position.find({ userId, status: 'PENDING' }).sort({ openedAt: -1 });
      } catch (e) {
        positions = MEMORY_POSITIONS.filter(p => p.status === 'OPEN');
      }
    } else {
      const { getQuoteBySymbol } = require('../services/marketDataService');
      MEMORY_POSITIONS.forEach(p => {
        if (p.status === 'OPEN') {
          const q = getQuoteBySymbol(p.symbol);
          if (q) {
            p.currentPrice = p.side === 'BUY' ? q.bid : q.ask;
            const diff = p.side === 'BUY' ? (p.currentPrice - p.entryPrice) : (p.entryPrice - p.currentPrice);
            p.unrealizedPL = Number((diff * p.units).toFixed(2));
            p.unrealizedPLPercent = Number(((p.unrealizedPL / (p.entryPrice * p.units)) * 100).toFixed(2));
          }
        }
      });
      positions = MEMORY_POSITIONS.filter(p => p.status === 'OPEN');
    }

    res.status(200).json({
      success: true,
      openPositionsCount: positions.length,
      positions,
      pending,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Close an active open position manually
// @route  POST /api/paper-trading/close
// @access Private
const closeOpenPosition = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    const { positionId } = req.body;

    if (isDbConnected()) {
      try {
        const result = await closePosition(userId, positionId, 'MANUAL');
        return res.status(200).json({
          success: true,
          message: `Position closed. Realized P/L: $${result.trade.realizedPL.toLocaleString()}`,
          data: result,
        });
      } catch (e) {
        // fallback
      }
    }

    const pos = MEMORY_POSITIONS.find(p => p._id === positionId && p.status === 'OPEN');
    if (!pos) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }

    pos.status = 'CLOSED';
    const realizedPL = pos.unrealizedPL || 0.00;
    const result = realizedPL > 0 ? 'WIN' : realizedPL < 0 ? 'LOSS' : 'BREAKEVEN';

    const trade = {
      _id: `trade_${Date.now()}`,
      userId,
      symbol: pos.symbol,
      side: pos.side,
      lots: pos.lots,
      entryPrice: pos.entryPrice,
      exitPrice: pos.currentPrice,
      realizedPL,
      result,
      closedAt: new Date(),
    };

    MEMORY_TRADES.unshift(trade);
    MEMORY_PORTFOLIO.balance = Number((MEMORY_PORTFOLIO.balance + realizedPL).toFixed(2));
    MEMORY_PORTFOLIO.equity = MEMORY_PORTFOLIO.balance;
    MEMORY_PORTFOLIO.usedMargin = Math.max(0, Number((MEMORY_PORTFOLIO.usedMargin - pos.marginRequired).toFixed(2)));
    MEMORY_PORTFOLIO.availableMargin = Number((MEMORY_PORTFOLIO.balance - MEMORY_PORTFOLIO.usedMargin).toFixed(2));
    MEMORY_PORTFOLIO.realizedPL = Number((MEMORY_PORTFOLIO.realizedPL + realizedPL).toFixed(2));
    MEMORY_PORTFOLIO.todayPL = Number((MEMORY_PORTFOLIO.todayPL + realizedPL).toFixed(2));
    MEMORY_PORTFOLIO.totalTrades += 1;
    if (result === 'WIN') MEMORY_PORTFOLIO.winningTrades += 1;
    if (result === 'LOSS') MEMORY_PORTFOLIO.losingTrades += 1;
    MEMORY_PORTFOLIO.winRate = Number(((MEMORY_PORTFOLIO.winningTrades / MEMORY_PORTFOLIO.totalTrades) * 100).toFixed(1));

    MEMORY_PORTFOLIO.equityHistory.push({
      timestamp: new Date(),
      balance: MEMORY_PORTFOLIO.balance,
      equity: MEMORY_PORTFOLIO.equity,
    });

    res.status(200).json({
      success: true,
      message: `Position closed. Realized P/L: $${realizedPL.toLocaleString()}`,
      data: { trade, portfolio: MEMORY_PORTFOLIO },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Modify Stop Loss and Take Profit
// @route  PUT /api/paper-trading/position/:id
// @access Private
const updatePositionLimits = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    const { stopLoss, takeProfit } = req.body;
    const parsedSL = stopLoss !== undefined && stopLoss !== '' && stopLoss !== null ? parseFloat(stopLoss) : null;
    const parsedTP = takeProfit !== undefined && takeProfit !== '' && takeProfit !== null ? parseFloat(takeProfit) : null;

    if (isDbConnected()) {
      try {
        const updated = await Position.findOneAndUpdate(
          { _id: req.params.id, userId },
          { stopLoss: parsedSL, takeProfit: parsedTP },
          { new: true }
        );
        if (updated) {
          return res.status(200).json({ success: true, message: 'Position limits updated successfully', data: updated });
        }
      } catch (e) {
        // fallback
      }
    }

    const pos = MEMORY_POSITIONS.find(p => p._id === req.params.id);
    if (pos) {
      pos.stopLoss = parsedSL;
      pos.takeProfit = parsedTP;
      return res.status(200).json({ success: true, message: 'Position limits updated successfully', data: pos });
    }

    res.status(404).json({ success: false, message: 'Position not found' });
  } catch (err) {
    next(err);
  }
};

// @desc   Get trade history
// @route  GET /api/paper-trading/history
// @access Private
const getTradeHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';
    let trades = MEMORY_TRADES;
    if (isDbConnected()) {
      try {
        trades = await Trade.find({ userId }).sort({ closedAt: -1 }).limit(100);
      } catch (e) {
        trades = MEMORY_TRADES;
      }
    }
    res.status(200).json({ success: true, count: trades.length, data: trades });
  } catch (err) {
    next(err);
  }
};

// @desc   Reset virtual demo balance
// @route  POST /api/paper-trading/reset
// @access Private
const resetAccount = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (isDbConnected() && userId) {
      try {
        await Position.updateMany({ userId, status: 'OPEN' }, { status: 'CLOSED' });
        await Portfolio.findOneAndUpdate(
          { userId },
          {
            initialBalance: 100000.00,
            virtualBalance: 100000.00,
            equity: 100000.00,
            usedMargin: 0.00,
            availableMargin: 100000.00,
            totalRealizedPL: 0.00,
            todayRealizedPL: 0.00,
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            winRate: 0.00,
            equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        // fallback
      }
    }

    MEMORY_POSITIONS = [];
    MEMORY_TRADES = [];
    MEMORY_PORTFOLIO = {
      balance: 100000.00,
      equity: 100000.00,
      usedMargin: 0.00,
      availableMargin: 100000.00,
      floatingPL: 0.00,
      realizedPL: 0.00,
      todayPL: 0.00,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0.00,
      equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
    };
    res.status(200).json({ success: true, message: 'Virtual account reset to $100,000.00', portfolio: MEMORY_PORTFOLIO });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getPositions,
  closeOpenPosition,
  updatePositionLimits,
  getTradeHistory,
  resetAccount,
  MEMORY_PORTFOLIO,
  MEMORY_POSITIONS,
  MEMORY_TRADES,
};
