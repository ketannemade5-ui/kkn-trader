import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  LineStyle,
  CrosshairMode,
} from 'lightweight-charts';
import { marketAPI } from '../../services/api';
import { useMarket } from '../../context/MarketContext';
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  Activity,
  Layers,
  BarChart2,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  Crosshair as CrosshairIcon,
  PlusCircle,
  Trash2,
  Zap,
} from 'lucide-react';

export const TradingViewChart = ({
  symbol = 'XAU/USD',
  height = 520,
  activePositions = [],
  onQuickTrade,
}) => {
  const { currentQuote, selectedSymbol } = useMarket();
  const activeSymbol = symbol || selectedSymbol || 'XAU/USD';

  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' | 'line' | 'area' | 'bar'
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Indicators toggle state
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showEMA20, setShowEMA20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);

  // Crosshair hover OHLCV state
  const [hoverData, setHoverData] = useState(null);

  // Drawing support/resistance horizontal lines
  const [horizontalLines, setHorizontalLines] = useState([]);

  // DOM Refs
  const containerRef = useRef(null);
  const chartWrapperRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const sma20SeriesRef = useRef(null);
  const sma50SeriesRef = useRef(null);
  const ema20SeriesRef = useRef(null);
  const bbUpperSeriesRef = useRef(null);
  const bbMiddleSeriesRef = useRef(null);
  const bbLowerSeriesRef = useRef(null);
  const rsiSeriesRef = useRef(null);
  const positionPriceLinesRef = useRef([]);
  const horizontalPriceLinesRef = useRef([]);

  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];

  // ==========================================
  // 1. DATA FETCHING
  // ==========================================
  const fetchCandles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await marketAPI.getHistory(activeSymbol, timeframe, 150);
      if (res && res.success && Array.isArray(res.data)) {
        // Ensure strictly sorted ascending by time and unique
        const sorted = [...res.data].sort((a, b) => a.time - b.time);
        const unique = [];
        const seen = new Set();
        for (const c of sorted) {
          if (!seen.has(c.time)) {
            seen.add(c.time);
            unique.push(c);
          }
        }
        setCandles(unique);
        setIsLiveFeed(Boolean(res.isLiveFeed));
      }
    } catch (err) {
      console.warn('Failed to load candlestick history:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSymbol, timeframe]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  // ==========================================
  // 2. TECHNICAL INDICATOR CALCULATIONS
  // ==========================================
  const calculateSMA = (data, period) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) continue;
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[i - j].close;
      result.push({ time: data[i].time, value: sum / period });
    }
    return result;
  };

  const calculateEMA = (data, period) => {
    const result = [];
    const k = 2 / (period + 1);
    let prevEma = null;
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) continue;
      if (prevEma === null) {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += data[i - j].close;
        prevEma = sum / period;
      } else {
        prevEma = data[i].close * k + prevEma * (1 - k);
      }
      result.push({ time: data[i].time, value: prevEma });
    }
    return result;
  };

  const calculateBollingerBands = (data, period = 20, multiplier = 2) => {
    const upper = [];
    const middle = [];
    const lower = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) continue;
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[i - j].close;
      const sma = sum / period;
      let varianceSum = 0;
      for (let j = 0; j < period; j++) varianceSum += Math.pow(data[i - j].close - sma, 2);
      const stdDev = Math.sqrt(varianceSum / period);
      middle.push({ time: data[i].time, value: sma });
      upper.push({ time: data[i].time, value: sma + multiplier * stdDev });
      lower.push({ time: data[i].time, value: sma - multiplier * stdDev });
    }
    return { upper, middle, lower };
  };

  const calculateRSI = (data, period = 14) => {
    const result = [];
    if (data.length <= period) return result;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = data[i].close - data[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: data[period].time, value: 100 - (100 / (1 + rs)) });

    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i].close - data[i - 1].close;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push({ time: data[i].time, value: 100 - (100 / (1 + rs)) });
    }
    return result;
  };

  // ==========================================
  // 3. INITIALIZE TRADINGVIEW LIGHTWEIGHT CHART
  // ==========================================
  useEffect(() => {
    if (!chartWrapperRef.current) return;

    // Clean up previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const currentContainer = chartWrapperRef.current;
    const clientWidth = currentContainer.clientWidth || 800;
    const clientHeight = isFullscreen ? window.innerHeight - 120 : height;

    const chart = createChart(currentContainer, {
      width: clientWidth,
      height: clientHeight,
      layout: {
        background: { color: '#090d16' }, // Institutional dark navy background
        textColor: '#94a3b8',
        fontSize: 12,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Inter', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.45)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(30, 41, 59, 0.45)', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#d4af37',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#d4af37',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#d4af37',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.22 : 0.1,
        },
        autoScale: true,
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: timeframe === '1m',
        shiftVisibleRangeOnNewBar: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartInstanceRef.current = chart;

    // 1. Create Main Price Series based on chartType
    let mainSeries;
    if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, {
        color: '#d4af37',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(212, 175, 55, 0.45)',
        bottomColor: 'rgba(212, 175, 55, 0.02)',
        lineColor: '#d4af37',
        lineWidth: 2,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
    } else if (chartType === 'bar') {
      mainSeries = chart.addSeries(BarSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        openVisible: true,
        thinBars: false,
      });
    } else {
      // Default: Candlestick Series
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    }
    mainSeriesRef.current = mainSeries;

    // 2. Volume Histogram Series (on overlay price scale)
    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume_scale',
      });
      chart.priceScale('volume_scale').applyOptions({
        scaleMargins: { top: 0.78, bottom: 0 },
        visible: false,
      });
      volumeSeriesRef.current = volumeSeries;
    }

    // 3. Technical Indicators Series
    if (showSMA20) {
      sma20SeriesRef.current = chart.addSeries(LineSeries, {
        color: '#06b6d4', // Cyan
        lineWidth: 2,
        title: 'SMA 20',
      });
    }
    if (showSMA50) {
      sma50SeriesRef.current = chart.addSeries(LineSeries, {
        color: '#f59e0b', // Amber
        lineWidth: 2,
        title: 'SMA 50',
      });
    }
    if (showEMA20) {
      ema20SeriesRef.current = chart.addSeries(LineSeries, {
        color: '#8b5cf6', // Purple
        lineWidth: 2,
        title: 'EMA 20',
      });
    }
    if (showBollinger) {
      bbUpperSeriesRef.current = chart.addSeries(LineSeries, {
        color: '#38bdf8',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BB Upper',
      });
      bbMiddleSeriesRef.current = chart.addSeries(LineSeries, {
        color: '#0284c7',
        lineWidth: 1.5,
        title: 'BB Mid',
      });
      bbLowerSeriesRef.current = chart.addSeries(LineSeries, {
        color: '#38bdf8',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BB Lower',
      });
    }
    if (showRSI) {
      rsiSeriesRef.current = chart.addSeries(LineSeries, {
        color: '#ec4899', // Pink
        lineWidth: 1.8,
        priceScaleId: 'rsi_scale',
        title: 'RSI 14',
      });
      chart.priceScale('rsi_scale').applyOptions({
        scaleMargins: { top: 0.75, bottom: 0.05 },
        visible: false,
      });
    }

    // Crosshair subscription
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData && mainSeriesRef.current) {
        const candleData = param.seriesData.get(mainSeriesRef.current);
        if (candleData) {
          setHoverData(candleData);
        }
      } else {
        setHoverData(null);
      }
    });

    // Resize Observer for auto responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartInstanceRef.current) return;
      const { width, height: h } = entries[0].contentRect;
      chartInstanceRef.current.applyOptions({
        width: Math.floor(width),
        height: isFullscreen ? window.innerHeight - 120 : height,
      });
    });

    resizeObserver.observe(currentContainer);

    return () => {
      resizeObserver.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [chartType, showSMA20, showSMA50, showEMA20, showBollinger, showVolume, showRSI, isFullscreen, height]);

  // ==========================================
  // 4. POPULATE DATA ON CHART & INDICATORS
  // ==========================================
  useEffect(() => {
    if (!chartInstanceRef.current || !mainSeriesRef.current || candles.length === 0) return;

    try {
      if (chartType === 'line' || chartType === 'area') {
        const lineData = candles.map((c) => ({ time: c.time, value: c.close }));
        mainSeriesRef.current.setData(lineData);
      } else {
        mainSeriesRef.current.setData(candles);
      }

      // Volume
      if (volumeSeriesRef.current && showVolume) {
        const volumeData = candles.map((c) => ({
          time: c.time,
          value: c.volume || 1000,
          color: c.close >= c.open ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      // SMA 20
      if (sma20SeriesRef.current && showSMA20) {
        sma20SeriesRef.current.setData(calculateSMA(candles, 20));
      }
      // SMA 50
      if (sma50SeriesRef.current && showSMA50) {
        sma50SeriesRef.current.setData(calculateSMA(candles, 50));
      }
      // EMA 20
      if (ema20SeriesRef.current && showEMA20) {
        ema20SeriesRef.current.setData(calculateEMA(candles, 20));
      }
      // Bollinger Bands
      if (showBollinger && bbUpperSeriesRef.current && bbMiddleSeriesRef.current && bbLowerSeriesRef.current) {
        const bb = calculateBollingerBands(candles, 20, 2);
        bbUpperSeriesRef.current.setData(bb.upper);
        bbMiddleSeriesRef.current.setData(bb.middle);
        bbLowerSeriesRef.current.setData(bb.lower);
      }
      // RSI 14
      if (rsiSeriesRef.current && showRSI) {
        rsiSeriesRef.current.setData(calculateRSI(candles, 14));
      }

      chartInstanceRef.current.timeScale().fitContent();
    } catch (err) {
      console.warn('Error setting chart data:', err.message);
    }
  }, [candles, chartType, showSMA20, showSMA50, showEMA20, showBollinger, showVolume, showRSI]);

  // ==========================================
  // 5. LIVE TICK PRICE STREAMING UPDATE
  // ==========================================
  useEffect(() => {
    if (
      !mainSeriesRef.current ||
      candles.length === 0 ||
      !currentQuote ||
      currentQuote.symbol !== activeSymbol ||
      !currentQuote.price
    ) {
      return;
    }

    try {
      const price = currentQuote.price;
      const lastCandle = candles[candles.length - 1];

      const updatedCandle = {
        ...lastCandle,
        close: price,
        high: Math.max(lastCandle.high, price),
        low: Math.min(lastCandle.low, price),
      };

      if (chartType === 'line' || chartType === 'area') {
        mainSeriesRef.current.update({ time: lastCandle.time, value: price });
      } else {
        mainSeriesRef.current.update(updatedCandle);
      }
    } catch (e) {
      // transient tick update error
    }
  }, [currentQuote?.price, activeSymbol, chartType]);

  // ==========================================
  // 6. ON-CHART ACTIVE POSITION & SL/TP PRICE LINES
  // ==========================================
  useEffect(() => {
    if (!mainSeriesRef.current) return;

    // Clear previous position price lines
    positionPriceLinesRef.current.forEach((line) => {
      try {
        mainSeriesRef.current.removePriceLine(line);
      } catch (e) {}
    });
    positionPriceLinesRef.current = [];

    // Filter positions for current symbol
    const symPositions = (activePositions || []).filter(
      (p) => p.symbol === activeSymbol && p.status === 'OPEN'
    );

    symPositions.forEach((pos) => {
      // 1. Entry Line
      if (pos.entryPrice) {
        const entryLine = mainSeriesRef.current.createPriceLine({
          price: pos.entryPrice,
          color: pos.side === 'BUY' ? '#38bdf8' : '#f97316',
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: `${pos.side} ${pos.lots}L @ ${pos.entryPrice}`,
        });
        positionPriceLinesRef.current.push(entryLine);
      }

      // 2. Stop Loss Line
      if (pos.stopLoss) {
        const slLine = mainSeriesRef.current.createPriceLine({
          price: pos.stopLoss,
          color: '#ef4444', // Red
          lineWidth: 2,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: `SL: ${pos.stopLoss}`,
        });
        positionPriceLinesRef.current.push(slLine);
      }

      // 3. Take Profit Line
      if (pos.takeProfit) {
        const tpLine = mainSeriesRef.current.createPriceLine({
          price: pos.takeProfit,
          color: '#10b981', // Green
          lineWidth: 2,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: `TP: ${pos.takeProfit}`,
        });
        positionPriceLinesRef.current.push(tpLine);
      }
    });
  }, [activePositions, activeSymbol]);

  // ==========================================
  // 7. HORIZONTAL SUPPORT/RESISTANCE DRAWINGS
  // ==========================================
  useEffect(() => {
    if (!mainSeriesRef.current) return;

    // Clear previous drawing price lines
    horizontalPriceLinesRef.current.forEach((line) => {
      try {
        mainSeriesRef.current.removePriceLine(line);
      } catch (e) {}
    });
    horizontalPriceLinesRef.current = [];

    horizontalLines.forEach((lvl) => {
      const line = mainSeriesRef.current.createPriceLine({
        price: lvl.price,
        color: lvl.color || '#d4af37',
        lineWidth: 1.5,
        lineStyle: LineStyle.LargeDashed,
        axisLabelVisible: true,
        title: lvl.title || `Level ${lvl.price}`,
      });
      horizontalPriceLinesRef.current.push(line);
    });
  }, [horizontalLines]);

  const addCurrentPriceLevel = () => {
    const p = currentQuote?.price || (candles.length > 0 ? candles[candles.length - 1].close : 0);
    if (!p) return;
    setHorizontalLines((prev) => [
      ...prev,
      {
        id: `lvl_${Date.now()}`,
        price: p,
        color: '#d4af37',
        title: `KEY LEVEL: ${p}`,
      },
    ]);
  };

  const clearLevels = () => {
    setHorizontalLines([]);
  };

  const resetChartView = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().fitContent();
    }
  };

  const latestCandle = candles.length > 0 ? candles[candles.length - 1] : null;
  const displayData = hoverData || latestCandle;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4' : 'w-full'
      }`}
    >
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/70">
        {/* Symbol and Feed Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white font-mono tracking-wide">
              {activeSymbol}
            </span>
            {isLiveFeed ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE FEED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                SIMULATION
              </span>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 overflow-x-auto">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded font-mono transition-all ${
                  timeframe === tf
                    ? 'bg-kkn-gold text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlesticks"
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                chartType === 'candlestick' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              title="Line Chart"
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                chartType === 'line' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Chart"
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                chartType === 'area' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              title="OHLC Bar Chart"
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                chartType === 'bar' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bars
            </button>
          </div>
        </div>

        {/* Technical Indicators & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
              showSMA20
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            SMA 20
          </button>

          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
              showEMA20
                ? 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            EMA 20
          </button>

          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
              showBollinger
                ? 'bg-sky-950/80 border-sky-500/40 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            BB (20,2)
          </button>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
              showVolume
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Vol
          </button>

          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
              showRSI
                ? 'bg-pink-950/80 border-pink-500/40 text-pink-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            RSI
          </button>

          {/* Add S/R Level */}
          <button
            onClick={addCurrentPriceLevel}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-kkn-gold hover:border-kkn-gold/40 transition-all flex items-center gap-1 text-xs font-semibold"
            title="Mark Horizontal Support/Resistance Level"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Level</span>
          </button>

          {horizontalLines.length > 0 && (
            <button
              onClick={clearLevels}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/50 transition-all"
              title="Clear Drawing Levels"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Reset View */}
          <button
            onClick={resetChartView}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Fit & Reset Chart View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* OHLCV Crosshair & Live Metric Ribbon */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        {displayData ? (
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              O: <strong className="text-white">{displayData.open ?? displayData.value}</strong>
            </span>
            {displayData.high !== undefined && (
              <span>
                H: <strong className="text-emerald-400">{displayData.high}</strong>
              </span>
            )}
            {displayData.low !== undefined && (
              <span>
                L: <strong className="text-rose-400">{displayData.low}</strong>
              </span>
            )}
            <span>
              C: <strong className="text-white">{displayData.close ?? displayData.value}</strong>
            </span>
            {displayData.volume !== undefined && (
              <span>
                Vol: <strong className="text-sky-300">{displayData.volume?.toLocaleString()}</strong>
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-500">Hover crosshair over chart to inspect candle OHLCV data</span>
        )}

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-kkn-gold/90 font-mono">TradingView™ Lightweight Engine</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Pan / Zoom Enabled</span>
        </div>
      </div>

      {/* TradingView Chart Container Area */}
      <div className="relative w-full overflow-hidden" style={{ height: isFullscreen ? 'calc(100vh - 140px)' : `${height}px` }}>
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-kkn-gold/30 border-t-kkn-gold rounded-full animate-spin"></div>
              <span className="text-xs font-mono text-slate-300">Synchronizing Market Candles...</span>
            </div>
          </div>
        )}

        <div ref={chartWrapperRef} className="w-full h-full cursor-crosshair" />
      </div>
    </div>
  );
};
