// KKN TRADER - Paper Trading Execution Engine
// Educational Simulation Engine - Uses Virtual Money Only ($100,000 Default Account)

const Position = require('../models/Position');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');
const JournalEntry = require('../models/JournalEntry');
const { getQuoteBySymbol, liveQuotes } = require('./marketDataService');

// Standard Contract Units
const CONTRACT_UNITS = {
  'Forex': 100000,   // 1 Standard Lot = 100,000 units
  'Metals': 100,     // 1 Lot Gold = 100 oz, Silver = 5000 oz
  'Crypto': 1,       // 1 Lot = 1 Coin
  'Indices': 1,      // 1 Lot = 1 Contract
  'Commodities': 1000// 1 Lot Oil = 1,000 Barrels
};

const LEVERAGE = 100; // 1:100 simulation leverage

const calculatePositionUnits = (symbol, lots, category) => {
  if (symbol === 'XAU/USD') return lots * 100;
  if (symbol === 'XAG/USD') return lots * 5000;
  if (category === 'Forex') return lots * 100000;
  if (category === 'Crypto') return lots * 1;
  if (category === 'Indices') return lots * 10;
  if (category === 'Commodities') return lots * 1000;
  return lots * 100;
};

const calculateMarginRequired = (units, entryPrice) => {
  return Number(((units * entryPrice) / LEVERAGE).toFixed(2));
};

const calculatePL = (side, entryPrice, currentPrice, units) => {
  if (side === 'BUY') {
    return Number(((currentPrice - entryPrice) * units).toFixed(2));
  } else {
    return Number(((entryPrice - currentPrice) * units).toFixed(2));
  }
};

const openPosition = async (userId, { symbol, side, orderType = 'MARKET', lots, stopLoss, takeProfit, strategySetup }) => {
  const uid = String(userId);
  const quote = getQuoteBySymbol(symbol);
  if (!quote) {
    throw new Error(`Invalid trading instrument: ${symbol}`);
  }

  const executionPrice = side === 'BUY' ? quote.ask : quote.bid;
  const units = calculatePositionUnits(symbol, lots, quote.category);
  const marginRequired = calculateMarginRequired(units, executionPrice);

  let portfolio = await Portfolio.findOne({ $or: [{ userId: uid }, { userId }] });
  if (!portfolio) {
    portfolio = await Portfolio.create({
      userId: uid,
      initialBalance: 100000,
      virtualBalance: 100000,
      equity: 100000,
      availableMargin: 100000,
      equityHistory: [{ timestamp: new Date(), balance: 100000, equity: 100000 }],
    });
  } else if (portfolio.initialBalance === 10000 && portfolio.totalTrades === 0 && portfolio.usedMargin === 0) {
    // Safe auto-migration from legacy 10k to 100k
    portfolio.initialBalance = 100000;
    portfolio.virtualBalance = 100000;
    portfolio.equity = 100000;
    portfolio.availableMargin = 100000;
    portfolio.equityHistory = [{ timestamp: new Date(), balance: 100000, equity: 100000 }];
    await portfolio.save();
  }

  if (portfolio.availableMargin < marginRequired) {
    throw new Error(`Insufficient virtual margin. Required: $${marginRequired.toLocaleString()}, Available: $${portfolio.availableMargin.toLocaleString()}`);
  }

  // Calculate Risk / Reward if SL and TP provided
  let riskRewardRatio = 0;
  if (stopLoss && takeProfit) {
    const riskDistance = Math.abs(executionPrice - stopLoss);
    const rewardDistance = Math.abs(takeProfit - executionPrice);
    if (riskDistance > 0) {
      riskRewardRatio = Number((rewardDistance / riskDistance).toFixed(2));
    }
  }

  const position = await Position.create({
    userId: uid,
    symbol: quote.symbol,
    side,
    orderType,
    lots,
    units,
    entryPrice: executionPrice,
    currentPrice: executionPrice,
    stopLoss: stopLoss || null,
    takeProfit: takeProfit || null,
    marginRequired,
    riskRewardRatio,
    strategySetup: strategySetup || 'Price Action & Liquidity Sweep',
    status: 'OPEN',
  });

  // Deduct margin
  portfolio.usedMargin = Number((portfolio.usedMargin + marginRequired).toFixed(2));
  portfolio.availableMargin = Number((portfolio.virtualBalance - portfolio.usedMargin).toFixed(2));
  await portfolio.save();

  return position;
};

const closePosition = async (userId, positionId, closeReason = 'MANUAL') => {
  const uid = String(userId);
  const position = await Position.findOne({
    _id: positionId,
    $or: [{ userId: uid }, { userId }],
    status: 'OPEN',
  });
  if (!position) {
    throw new Error('Active position not found');
  }

  const quote = getQuoteBySymbol(position.symbol);
  const currentPrice = quote ? (position.side === 'BUY' ? quote.bid : quote.ask) : position.currentPrice;
  const realizedPL = calculatePL(position.side, position.entryPrice, currentPrice, position.units);
  const realizedPLPercent = Number(((realizedPL / (position.entryPrice * position.units)) * 100).toFixed(2));

  let result = 'BREAKEVEN';
  if (realizedPL > 0.05) result = 'WIN';
  else if (realizedPL < -0.05) result = 'LOSS';

  let plannedRisk = 0;
  let plannedReward = 0;
  let riskRewardRatio = 0;
  let riskRewardAchieved = 0;
  if (position.stopLoss) {
    plannedRisk = Number((Math.abs(position.entryPrice - position.stopLoss) * position.units).toFixed(2));
    if (plannedRisk > 0) {
      riskRewardAchieved = Number((realizedPL / plannedRisk).toFixed(2));
    }
  }
  if (position.takeProfit) {
    plannedReward = Number((Math.abs(position.takeProfit - position.entryPrice) * position.units).toFixed(2));
  }
  if (plannedRisk > 0 && plannedReward > 0) {
    riskRewardRatio = Number((plannedReward / plannedRisk).toFixed(2));
  }

  // Mark position closed
  position.status = 'CLOSED';
  position.currentPrice = currentPrice;
  position.unrealizedPL = 0;
  await position.save();

  // Create Trade Record in MongoDB for this specific user
  const trade = await Trade.create({
    userId: uid,
    positionId: position._id,
    symbol: position.symbol,
    side: position.side,
    lots: position.lots,
    entryPrice: position.entryPrice,
    exitPrice: currentPrice,
    stopLoss: position.stopLoss || null,
    takeProfit: position.takeProfit || null,
    risk: plannedRisk,
    reward: plannedReward,
    riskRewardRatio: riskRewardRatio,
    realizedPL,
    realizedPLPercent,
    riskRewardAchieved,
    result,
    tradeStatus: 'CLOSED',
    closeReason,
    openedAt: position.openedAt || new Date(),
    closedAt: new Date(),
    strategySetup: position.strategySetup || 'Price Action & Liquidity Sweep',
  });

  // Automatically Create Journal Entry in MongoDB
  let journalEntry = null;
  try {
    journalEntry = await JournalEntry.create({
      userId: uid,
      tradeId: trade._id,
      symbol: position.symbol,
      side: position.side,
      entryPrice: position.entryPrice,
      exitPrice: currentPrice,
      stopLoss: position.stopLoss || null,
      takeProfit: position.takeProfit || null,
      lots: position.lots,
      realizedPL,
      riskReward: riskRewardAchieved,
      result,
      strategySetup: position.strategySetup || 'Price Action & Liquidity Sweep',
      tradeReason: `Executed ${position.side} order based on institutional price structure.`,
      emotion: 'Calm & Disciplined',
      mistake: result === 'WIN' ? 'None - Followed Rules' : 'Review entry timing',
      lessonLearned: `Risk was strictly managed at ${position.lots} lots. Always protect capital.`,
      tags: [position.symbol, position.side, result],
    });

    trade.journalEntryId = journalEntry._id;
    await trade.save();
  } catch (jErr) {
    console.warn('[Auto Journal Entry Creation Notice]:', jErr.message);
  }

  // Update User Portfolio in MongoDB
  const portfolio = await Portfolio.findOne({ $or: [{ userId: uid }, { userId }] });
  if (portfolio) {
    portfolio.virtualBalance = Number((portfolio.virtualBalance + realizedPL).toFixed(2));
    portfolio.usedMargin = Math.max(0, Number((portfolio.usedMargin - position.marginRequired).toFixed(2)));
    portfolio.equity = Number((portfolio.virtualBalance).toFixed(2));
    portfolio.availableMargin = Number((portfolio.virtualBalance - portfolio.usedMargin).toFixed(2));
    portfolio.totalRealizedPL = Number((portfolio.totalRealizedPL + realizedPL).toFixed(2));
    portfolio.todayRealizedPL = Number((portfolio.todayRealizedPL + realizedPL).toFixed(2));
    
    portfolio.totalTrades += 1;
    if (result === 'WIN') portfolio.winningTrades += 1;
    else if (result === 'LOSS') portfolio.losingTrades += 1;

    if (portfolio.totalTrades > 0) {
      portfolio.winRate = Number(((portfolio.winningTrades / portfolio.totalTrades) * 100).toFixed(1));
    }

    portfolio.equityHistory.push({
      timestamp: new Date(),
      balance: portfolio.virtualBalance,
      equity: portfolio.equity,
    });

    await portfolio.save();
  }

  return { trade, journalEntry, portfolio };
};

// Tick monitor for all open positions across all simulated accounts
const runPaperTradingMonitor = async () => {
  try {
    const openPositions = await Position.find({ status: 'OPEN' });
    if (!openPositions || openPositions.length === 0) return;

    for (const pos of openPositions) {
      const quote = getQuoteBySymbol(pos.symbol);
      if (!quote) continue;

      const currentPrice = pos.side === 'BUY' ? quote.bid : quote.ask;
      const unrealizedPL = calculatePL(pos.side, pos.entryPrice, currentPrice, pos.units);
      const unrealizedPLPercent = Number(((unrealizedPL / (pos.entryPrice * pos.units)) * 100).toFixed(2));

      pos.currentPrice = currentPrice;
      pos.unrealizedPL = unrealizedPL;
      pos.unrealizedPLPercent = unrealizedPLPercent;

      // Check Stop Loss Trigger (only if explicitly set as a positive number)
      if (typeof pos.stopLoss === 'number' && pos.stopLoss > 0) {
        const slHit = pos.side === 'BUY' ? currentPrice <= pos.stopLoss : currentPrice >= pos.stopLoss;
        if (slHit) {
          await closePosition(pos.userId, pos._id, 'STOP_LOSS');
          continue;
        }
      }

      // Check Take Profit Trigger (only if explicitly set as a positive number)
      if (typeof pos.takeProfit === 'number' && pos.takeProfit > 0) {
        const tpHit = pos.side === 'BUY' ? currentPrice >= pos.takeProfit : currentPrice <= pos.takeProfit;
        if (tpHit) {
          await closePosition(pos.userId, pos._id, 'TAKE_PROFIT');
          continue;
        }
      }

      await pos.save();
    }
  } catch (err) {
    // Ignore transient loop errors in background monitor
  }
};

// Run monitor every 2 seconds
setInterval(runPaperTradingMonitor, 2000);

module.exports = {
  calculatePositionUnits,
  calculateMarginRequired,
  calculatePL,
  openPosition,
  closePosition,
};
