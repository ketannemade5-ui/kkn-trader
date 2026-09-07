const { generateOHLCV, BASE_INSTRUMENTS } = require('../services/marketDataService');

// @desc   Initialize historical backtesting session with historical candle feed
// @route  GET /api/backtest/session
// @access Public
const getBacktestData = async (req, res, next) => {
  try {
    const { symbol = 'XAU/USD', timeframe = '15m', limit = 150 } = req.query;
    const cleanSymbol = symbol.toUpperCase().replace('-', '/');
    const candles = generateOHLCV(cleanSymbol, timeframe, parseInt(limit, 10));

    res.status(200).json({
      success: true,
      symbol: cleanSymbol,
      timeframe,
      totalCandles: candles.length,
      historicalCandles: candles.slice(0, Math.floor(candles.length * 0.7)),
      unrevealedCandles: candles.slice(Math.floor(candles.length * 0.7)),
      disclaimer: 'Educational historical market playback. No real money or live broker execution.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBacktestData,
};
