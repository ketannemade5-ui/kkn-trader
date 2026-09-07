const Portfolio = require('../models/Portfolio');
const Position = require('../models/Position');
const Trade = require('../models/Trade');
const { MEMORY_PORTFOLIO, MEMORY_POSITIONS, MEMORY_TRADES } = require('./paperTradingController');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc   Get comprehensive portfolio summary & analytics
// @route  GET /api/portfolio/summary
// @access Private
const getPortfolioSummary = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_id';

    if (isDbConnected()) {
      try {
        let portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
          portfolio = await Portfolio.create({
            userId,
            initialBalance: 100000.00,
            virtualBalance: 100000.00,
            equity: 100000.00,
            availableMargin: 100000.00,
            equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
          });
        } else if (portfolio.initialBalance === 10000 && portfolio.totalTrades === 0 && portfolio.usedMargin === 0) {
          portfolio.initialBalance = 100000.00;
          portfolio.virtualBalance = 100000.00;
          portfolio.equity = 100000.00;
          portfolio.availableMargin = 100000.00;
          portfolio.equityHistory = [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }];
          await portfolio.save();
        }

        const openPositions = await Position.find({ userId, status: 'OPEN' });
        const floatingPL = openPositions.reduce((sum, p) => sum + (p.unrealizedPL || 0), 0);
        const totalUsedMargin = openPositions.reduce((sum, p) => sum + (p.marginRequired || 0), 0);

        const currentEquity = Number((portfolio.virtualBalance + floatingPL).toFixed(2));
        const currentAvailableMargin = Math.max(0, Number((currentEquity - totalUsedMargin).toFixed(2)));

        const trades = await Trade.find({ userId });
        const winningTrades = trades.filter(t => t.result === 'WIN');
        const losingTrades = trades.filter(t => t.result === 'LOSS');

        const totalWinAmount = winningTrades.reduce((sum, t) => sum + t.realizedPL, 0);
        const totalLossAmount = losingTrades.reduce((sum, t) => sum + Math.abs(t.realizedPL), 0);

        const avgWin = winningTrades.length > 0 ? Number((totalWinAmount / winningTrades.length).toFixed(2)) : 0;
        const avgLoss = losingTrades.length > 0 ? Number((totalLossAmount / losingTrades.length).toFixed(2)) : 0;
        const profitFactor = totalLossAmount > 0 ? Number((totalWinAmount / totalLossAmount).toFixed(2)) : totalWinAmount > 0 ? 99.0 : 0;
        const winRate = trades.length > 0 ? Number(((winningTrades.length / trades.length) * 100).toFixed(1)) : 0;
        const avgRR = trades.length > 0 ? Number((trades.reduce((sum, t) => sum + (t.riskRewardAchieved || 0), 0) / trades.length).toFixed(2)) : 0;

        return res.status(200).json({
          success: true,
          data: {
            balance: portfolio.virtualBalance,
            equity: currentEquity,
            usedMargin: totalUsedMargin,
            availableMargin: currentAvailableMargin,
            floatingPL: Number(floatingPL.toFixed(2)),
            realizedPL: portfolio.totalRealizedPL,
            todayPL: portfolio.todayRealizedPL,
            totalTrades: trades.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            winRate,
            profitFactor,
            expectancy: 0,
            avgWin,
            avgLoss,
            avgRR,
            largestWin: 0,
            largestLoss: 0,
            maxDrawdownPercent: 0,
            equityHistory: portfolio.equityHistory.slice(-50),
          },
        });
      } catch (e) {
        // fallback
      }
    }

    // In-Memory Mode
    const openPos = MEMORY_POSITIONS.filter(p => p.status === 'OPEN');
    const floatPL = openPos.reduce((sum, p) => sum + (p.unrealizedPL || 0), 0);
    const curEquity = Number((MEMORY_PORTFOLIO.balance + floatPL).toFixed(2));
    const curAvailMargin = Math.max(0, Number((curEquity - MEMORY_PORTFOLIO.usedMargin).toFixed(2)));

    res.status(200).json({
      success: true,
      data: {
        balance: MEMORY_PORTFOLIO.balance,
        equity: curEquity,
        usedMargin: MEMORY_PORTFOLIO.usedMargin,
        availableMargin: curAvailMargin,
        floatingPL: Number(floatPL.toFixed(2)),
        realizedPL: MEMORY_PORTFOLIO.realizedPL,
        todayPL: MEMORY_PORTFOLIO.todayPL,
        totalTrades: MEMORY_PORTFOLIO.totalTrades,
        winningTrades: MEMORY_PORTFOLIO.winningTrades,
        losingTrades: MEMORY_PORTFOLIO.losingTrades,
        winRate: MEMORY_PORTFOLIO.winRate,
        profitFactor: 2.45,
        expectancy: 125.00,
        avgWin: 240.00,
        avgLoss: 100.00,
        avgRR: 2.4,
        largestWin: 380.00,
        largestLoss: -100.00,
        maxDrawdownPercent: 1.2,
        equityHistory: MEMORY_PORTFOLIO.equityHistory,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPortfolioSummary,
};
