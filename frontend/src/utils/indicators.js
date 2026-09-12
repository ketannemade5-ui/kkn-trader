// KKN TRADER - Comprehensive Technical Indicator Calculations Utility
// Computes actual mathematical indicators from candle OHLCV data for Lightweight Charts

/**
 * Simple Moving Average (SMA)
 */
export const calculateSMA = (candles, period = 20) => {
  if (!candles || candles.length < period) return [];
  const result = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += candles[i - j].close;
    }
    result.push({ time: candles[i].time, value: sum / period });
  }
  return result;
};

/**
 * Exponential Moving Average (EMA)
 */
export const calculateEMA = (candles, period = 20) => {
  if (!candles || candles.length < period) return [];
  const k = 2 / (period + 1);
  const result = [];

  // First value is simple average
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  let prevEMA = sum / period;
  result.push({ time: candles[period - 1].time, value: prevEMA });

  for (let i = period; i < candles.length; i++) {
    const current = candles[i].close * k + prevEMA * (1 - k);
    result.push({ time: candles[i].time, value: current });
    prevEMA = current;
  }
  return result;
};

/**
 * Weighted Moving Average (WMA)
 */
export const calculateWMA = (candles, period = 20) => {
  if (!candles || candles.length < period) return [];
  const weightSum = (period * (period + 1)) / 2;
  const result = [];

  for (let i = period - 1; i < candles.length; i++) {
    let weightedTotal = 0;
    for (let j = 0; j < period; j++) {
      const weight = period - j;
      weightedTotal += candles[i - j].close * weight;
    }
    result.push({ time: candles[i].time, value: weightedTotal / weightSum });
  }
  return result;
};

/**
 * Relative Strength Index (RSI)
 */
export const calculateRSI = (candles, period = 14) => {
  if (!candles || candles.length <= period) return [];
  const result = [];
  const gains = [];
  const losses = [];

  for (let i = 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);
  result.push({ time: candles[period].time, value: rsi });

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);
    result.push({ time: candles[i + 1].time, value: rsi });
  }

  return result;
};

/**
 * Moving Average Convergence Divergence (MACD)
 */
export const calculateMACD = (candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!candles || candles.length < slowPeriod + signalPeriod) return { macd: [], signal: [], histogram: [] };

  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  // Map by timestamp
  const slowMap = new Map();
  slowEMA.forEach((item) => slowMap.set(item.time, item.value));

  const macdLine = [];
  fastEMA.forEach((item) => {
    if (slowMap.has(item.time)) {
      macdLine.push({
        time: item.time,
        value: item.value - slowMap.get(item.time),
      });
    }
  });

  if (macdLine.length < signalPeriod) return { macd: [], signal: [], histogram: [] };

  // Calculate Signal line (EMA of MACD line)
  const k = 2 / (signalPeriod + 1);
  let sum = 0;
  for (let i = 0; i < signalPeriod; i++) {
    sum += macdLine[i].value;
  }
  let prevSignal = sum / signalPeriod;

  const signalLine = [{ time: macdLine[signalPeriod - 1].time, value: prevSignal }];
  const histogram = [{
    time: macdLine[signalPeriod - 1].time,
    value: macdLine[signalPeriod - 1].value - prevSignal,
    color: (macdLine[signalPeriod - 1].value - prevSignal) >= 0 ? '#10B981' : '#EF4444',
  }];

  for (let i = signalPeriod; i < macdLine.length; i++) {
    const curSignal = macdLine[i].value * k + prevSignal * (1 - k);
    const hist = macdLine[i].value - curSignal;
    signalLine.push({ time: macdLine[i].time, value: curSignal });
    histogram.push({
      time: macdLine[i].time,
      value: hist,
      color: hist >= 0 ? '#10B981' : '#EF4444',
    });
    prevSignal = curSignal;
  }

  return { macd: macdLine.slice(signalPeriod - 1), signal: signalLine, histogram };
};

/**
 * Bollinger Bands
 */
export const calculateBollingerBands = (candles, period = 20, multiplier = 2) => {
  if (!candles || candles.length < period) return { upper: [], middle: [], lower: [] };

  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += candles[i - j].close;
    }
    const mean = sum / period;

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(candles[i - j].close - mean, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    const t = candles[i].time;
    middle.push({ time: t, value: mean });
    upper.push({ time: t, value: mean + multiplier * stdDev });
    lower.push({ time: t, value: mean - multiplier * stdDev });
  }

  return { upper, middle, lower };
};

/**
 * Volume Weighted Average Price (VWAP)
 */
export const calculateVWAP = (candles) => {
  if (!candles || candles.length === 0) return [];
  const result = [];
  let cumVol = 0;
  let cumVolPrice = 0;

  for (let i = 0; i < candles.length; i++) {
    const typicalPrice = (candles[i].high + candles[i].low + candles[i].close) / 3;
    const vol = candles[i].volume || 1000;
    cumVolPrice += typicalPrice * vol;
    cumVol += vol;

    result.push({
      time: candles[i].time,
      value: cumVolPrice / (cumVol || 1),
    });
  }

  return result;
};

/**
 * Average True Range (ATR)
 */
export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length <= period) return [];
  const trs = [];

  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trs.push(tr);
  }

  let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const result = [{ time: candles[period].time, value: atr }];

  for (let i = period; i < trs.length; i++) {
    atr = (atr * (period - 1) + trs[i]) / period;
    result.push({ time: candles[i + 1].time, value: atr });
  }

  return result;
};

/**
 * Stochastic Oscillator (%K, %D)
 */
export const calculateStochastic = (candles, kPeriod = 14, dPeriod = 3) => {
  if (!candles || candles.length < kPeriod + dPeriod) return { k: [], d: [] };

  const rawK = [];
  for (let i = kPeriod - 1; i < candles.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    for (let j = 0; j < kPeriod; j++) {
      if (candles[i - j].high > highestHigh) highestHigh = candles[i - j].high;
      if (candles[i - j].low < lowestLow) lowestLow = candles[i - j].low;
    }
    const currentClose = candles[i].close;
    const range = highestHigh - lowestLow;
    const kVal = range === 0 ? 50 : ((currentClose - lowestLow) / range) * 100;
    rawK.push({ time: candles[i].time, value: kVal });
  }

  const d = [];
  for (let i = dPeriod - 1; i < rawK.length; i++) {
    let sum = 0;
    for (let j = 0; j < dPeriod; j++) {
      sum += rawK[i - j].value;
    }
    d.push({ time: rawK[i].time, value: sum / dPeriod });
  }

  return { k: rawK.slice(dPeriod - 1), d };
};

/**
 * Average Directional Index (ADX)
 */
export const calculateADX = (candles, period = 14) => {
  if (!candles || candles.length <= period * 2) return [];
  const result = [];
  // Calculate +DM, -DM, and TR
  const trs = [];
  const plusDMs = [];
  const minusDMs = [];

  for (let i = 1; i < candles.length; i++) {
    const upMove = candles[i].high - candles[i - 1].high;
    const downMove = candles[i - 1].low - candles[i].low;

    plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0);

    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    trs.push(tr);
  }

  let smoothedTR = trs.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDMs.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDMs.slice(0, period).reduce((a, b) => a + b, 0);

  const dxValues = [];
  for (let i = period; i < trs.length; i++) {
    smoothedTR = smoothedTR - (smoothedTR / period) + trs[i];
    smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDMs[i];
    smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDMs[i];

    const plusDI = (smoothedPlusDM / (smoothedTR || 1)) * 100;
    const minusDI = (smoothedMinusDM / (smoothedTR || 1)) * 100;

    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = diSum === 0 ? 0 : (diDiff / diSum) * 100;
    dxValues.push({ time: candles[i + 1].time, dx });
  }

  if (dxValues.length < period) return [];

  let adx = dxValues.slice(0, period).reduce((a, b) => a + b.dx, 0) / period;
  result.push({ time: dxValues[period - 1].time, value: adx });

  for (let i = period; i < dxValues.length; i++) {
    adx = (adx * (period - 1) + dxValues[i].dx) / period;
    result.push({ time: dxValues[i].time, value: adx });
  }

  return result;
};
