const Position = require('../models/Position');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');
const { openPosition, closePosition } = require('../services/paperTradingService');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to strictly extract the authenticated user ID from middleware
const getUserId = (req) => {
  return req.user?.uid || req.user?.id || req.user?._id;
};

// User-isolated in-memory fallback stores
const USER_POSITIONS_MAP = new Map();
const USER_TRADES_MAP = new Map();
const USER_PORTFOLIO_MAP = new Map();

const getUserPositions = (userId) => {
  const uid = String(userId);
  if (!USER_POSITIONS_MAP.has(uid)) {
    USER_POSITIONS_MAP.set(uid, []);
  }
  return USER_POSITIONS_MAP.get(uid);
};

const getUserTrades = (userId) => {
  const uid = String(userId);
  if (!USER_TRADES_MAP.has(uid)) {
    USER_TRADES_MAP.set(uid, []);
  }
  return USER_TRADES_MAP.get(uid);
};

const getUserPortfolio = (userId) => {
  const uid = String(userId);
  if (!USER_PORTFOLIO_MAP.has(uid)) {
    USER_PORTFOLIO_MAP.set(uid, {
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
    });
  }
  return USER_PORTFOLIO_MAP.get(uid);
};

// @desc   Execute virtual paper trading order (BUY / SELL)
// @route  POST /api/paper-trading/order
// @access Private (Requires Auth)
const placeOrder = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to place orders.' });
    }

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
        console.warn('[DB Place Order Notice]:', e.message);
      }
    }

    // In-memory isolated user execution
    const { getQuoteBySymbol } = require('../services/marketDataService');
    const quote = getQuoteBySymbol(symbol) || { price: 2385.40, bid: 2385.25, ask: 2385.55, digits: 2, category: 'Metals' };
    const execPrice = side.toUpperCase() === 'BUY' ? quote.ask : quote.bid;
    const units = parseFloat(lots) * (quote.category === 'Forex' ? 100000 : 100);
    const marginReq = Number(((units * execPrice) / 100).toFixed(2));

    const userPortfolio = getUserPortfolio(userId);
    if (userPortfolio.availableMargin < marginReq) {
      return res.status(400).json({
        success: false,
        message: `Insufficient virtual margin. Required: $${marginReq.toLocaleString()}, Available: $${userPortfolio.availableMargin.toLocaleString()}`,
      });
    }

    const newPos = {
      _id: `pos_${Date.now()}_${Math.random().toString(36).slice(-5)}`,
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

    const userPositions = getUserPositions(userId);
    userPositions.unshift(newPos);
    userPortfolio.usedMargin = Number((userPortfolio.usedMargin + marginReq).toFixed(2));
    userPortfolio.availableMargin = Number((userPortfolio.balance - userPortfolio.usedMargin).toFixed(2));

    res.status(201).json({
      success: true,
      message: `Virtual ${newPos.side} order for ${newPos.lots} lot(s) of ${newPos.symbol} executed successfully.`,
      data: newPos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get authenticated user's open and pending positions
// @route  GET /api/paper-trading/positions
// @access Private (Requires Auth)
const getPositions = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to view positions.' });
    }

    let positions = [];
    let pending = [];

    if (isDbConnected()) {
      try {
        positions = await Position.find({ userId, status: 'OPEN' }).sort({ openedAt: -1 });
        pending = await Position.find({ userId, status: 'PENDING' }).sort({ openedAt: -1 });
      } catch (e) {
        const userPos = getUserPositions(userId);
        positions = userPos.filter(p => p.status === 'OPEN');
        pending = userPos.filter(p => p.status === 'PENDING');
      }
    } else {
      const { getQuoteBySymbol } = require('../services/marketDataService');
      const userPos = getUserPositions(userId);
      userPos.forEach(p => {
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
      positions = userPos.filter(p => p.status === 'OPEN');
      pending = userPos.filter(p => p.status === 'PENDING');
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

// @desc   Get authenticated user's pending orders
// @route  GET /api/paper-trading/pending-orders
// @access Private (Requires Auth)
const getPendingOrders = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to view pending orders.' });
    }

    let pending = [];
    if (isDbConnected()) {
      try {
        pending = await Position.find({ userId, status: 'PENDING' }).sort({ openedAt: -1 });
      } catch (e) {
        const userPos = getUserPositions(userId);
        pending = userPos.filter(p => p.status === 'PENDING');
      }
    } else {
      const userPos = getUserPositions(userId);
      pending = userPos.filter(p => p.status === 'PENDING');
    }

    res.status(200).json({
      success: true,
      count: pending.length,
      data: pending,
      pending,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Close an active open position manually
// @route  POST /api/paper-trading/close
// @access Private (Requires Auth)
const closeOpenPosition = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to close positions.' });
    }

    const uid = String(userId);
    const { positionId } = req.body;
    if (!positionId) {
      return res.status(400).json({ success: false, message: 'positionId is required.' });
    }

    if (isDbConnected()) {
      try {
        const result = await closePosition(uid, positionId, 'MANUAL');
        return res.status(200).json({
          success: true,
          message: `Position closed. Realized P/L: $${result.trade.realizedPL.toLocaleString()}`,
          data: result,
        });
      } catch (e) {
        console.warn('[DB Close Position Notice]:', e.message);
      }
    }

    const userPos = getUserPositions(uid);
    const pos = userPos.find(p => (String(p._id) === String(positionId) || p._id === positionId) && p.status === 'OPEN');
    if (!pos) {
      return res.status(404).json({ success: false, message: 'Position not found or unauthorized' });
    }

    pos.status = 'CLOSED';
    const realizedPL = pos.unrealizedPL || 0.00;
    const realizedPLPercent = pos.unrealizedPLPercent || 0.00;
    const result = realizedPL > 0 ? 'WIN' : realizedPL < 0 ? 'LOSS' : 'BREAKEVEN';

    let plannedRisk = 0;
    let plannedReward = 0;
    let riskRewardRatio = 0;
    let riskRewardAchieved = 0;
    if (pos.stopLoss) {
      plannedRisk = Number((Math.abs(pos.entryPrice - pos.stopLoss) * pos.units).toFixed(2));
      if (plannedRisk > 0) {
        riskRewardAchieved = Number((realizedPL / plannedRisk).toFixed(2));
      }
    }
    if (pos.takeProfit) {
      plannedReward = Number((Math.abs(pos.takeProfit - pos.entryPrice) * pos.units).toFixed(2));
    }
    if (plannedRisk > 0 && plannedReward > 0) {
      riskRewardRatio = Number((plannedReward / plannedRisk).toFixed(2));
    }

    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).slice(-5)}`;
    const trade = {
      _id: tradeId,
      tradeId,
      userId: uid,
      positionId: pos._id,
      symbol: pos.symbol,
      side: pos.side,
      lots: pos.lots,
      entryPrice: pos.entryPrice,
      exitPrice: pos.currentPrice,
      stopLoss: pos.stopLoss || null,
      takeProfit: pos.takeProfit || null,
      risk: plannedRisk,
      reward: plannedReward,
      riskRewardRatio: riskRewardRatio,
      realizedPL,
      realizedPLPercent,
      riskRewardAchieved,
      result,
      tradeStatus: 'CLOSED',
      closeReason: 'MANUAL',
      openedAt: pos.openedAt || new Date(),
      closedAt: new Date(),
      strategySetup: 'Price Action & Key Levels',
    };

    const userTrades = getUserTrades(uid);
    userTrades.unshift(trade);

    // Save to MongoDB Trade collection if DB is connected
    if (isDbConnected()) {
      try {
        await Trade.create(trade);
      } catch (dbErr) {
        console.warn('[MongoDB Trade Create Fallback Notice]:', dbErr.message);
      }
    }

    const userPortfolio = getUserPortfolio(uid);
    userPortfolio.balance = Number((userPortfolio.balance + realizedPL).toFixed(2));
    userPortfolio.equity = userPortfolio.balance;
    userPortfolio.usedMargin = Math.max(0, Number((userPortfolio.usedMargin - pos.marginRequired).toFixed(2)));
    userPortfolio.availableMargin = Number((userPortfolio.balance - userPortfolio.usedMargin).toFixed(2));
    userPortfolio.realizedPL = Number((userPortfolio.realizedPL + realizedPL).toFixed(2));
    userPortfolio.todayPL = Number((userPortfolio.todayPL + realizedPL).toFixed(2));
    userPortfolio.totalTrades += 1;
    if (result === 'WIN') userPortfolio.winningTrades += 1;
    if (result === 'LOSS') userPortfolio.losingTrades += 1;
    userPortfolio.winRate = Number(((userPortfolio.winningTrades / userPortfolio.totalTrades) * 100).toFixed(1));

    userPortfolio.equityHistory.push({
      timestamp: new Date(),
      balance: userPortfolio.balance,
      equity: userPortfolio.equity,
    });

    res.status(200).json({
      success: true,
      message: `Position closed. Realized P/L: $${realizedPL.toLocaleString()}`,
      data: { trade, portfolio: userPortfolio },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Modify Stop Loss and Take Profit for authenticated user's position
// @route  PUT /api/paper-trading/position/:id
// @access Private (Requires Auth)
const updatePositionLimits = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to update limits.' });
    }

    const uid = String(userId);
    const { stopLoss, takeProfit } = req.body;
    const parsedSL = stopLoss !== undefined && stopLoss !== '' && stopLoss !== null ? parseFloat(stopLoss) : null;
    const parsedTP = takeProfit !== undefined && takeProfit !== '' && takeProfit !== null ? parseFloat(takeProfit) : null;

    if (isDbConnected()) {
      try {
        const updated = await Position.findOneAndUpdate(
          { _id: req.params.id, $or: [{ userId: uid }, { userId }] },
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

    const userPos = getUserPositions(uid);
    const pos = userPos.find(p => String(p._id) === String(req.params.id) && (p.userId === uid || p.userId === userId));
    if (pos) {
      pos.stopLoss = parsedSL;
      pos.takeProfit = parsedTP;
      return res.status(200).json({ success: true, message: 'Position limits updated successfully', data: pos });
    }

    res.status(404).json({ success: false, message: 'Position not found or unauthorized' });
  } catch (err) {
    next(err);
  }
};

// @desc   Get authenticated user's trade history
// @route  GET /api/paper-trading/history
// @access Private (Requires Auth)
const getTradeHistory = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to view history.' });
    }

    const uid = String(userId);
    let trades = [];
    const memTrades = getUserTrades(uid) || [];

    if (isDbConnected()) {
      try {
        const dbTrades = await Trade.find({ $or: [{ userId: uid }, { userId }] }).sort({ closedAt: -1 }).limit(100);
        const map = new Map();
        [...memTrades, ...dbTrades].forEach((t) => {
          if (!t) return;
          const id = String(t.tradeId || t._id || `${t.symbol}_${t.closedAt || t.openedAt}`);
          map.set(id, t);
        });
        trades = Array.from(map.values()).sort(
          (a, b) => new Date(b.closedAt || b.openedAt || 0) - new Date(a.closedAt || a.openedAt || 0)
        );
      } catch (e) {
        trades = memTrades;
      }
    } else {
      trades = memTrades;
    }
    res.status(200).json({ success: true, count: trades.length, data: trades });
  } catch (err) {
    next(err);
  }
};

// @desc   Reset authenticated user's virtual balance
// @route  POST /api/paper-trading/reset
// @access Private (Requires Auth)
const resetAccount = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to reset account.' });
    }

    if (isDbConnected()) {
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

    USER_POSITIONS_MAP.set(String(userId), []);
    USER_TRADES_MAP.set(String(userId), []);
    const resetPort = {
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
    USER_PORTFOLIO_MAP.set(String(userId), resetPort);

    res.status(200).json({ success: true, message: 'Virtual account reset to $100,000.00', portfolio: resetPort });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getPositions,
  getPendingOrders,
  closeOpenPosition,
  updatePositionLimits,
  getTradeHistory,
  resetAccount,
  getUserPortfolio,
  getUserPositions,
  getUserTrades,
};
