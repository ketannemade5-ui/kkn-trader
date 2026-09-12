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
import { DrawingToolsLayer, DRAWING_TOOLS } from './DrawingToolsLayer';
import {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP,
  calculateATR,
  calculateStochastic,
  calculateADX,
} from '../../utils/indicators';
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
  Trash2,
  Zap,
  PenTool,
  Share2,
  ArrowUpRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Ruler,
  Square,
  Minus,
  MoveVertical,
  Pointer,
} from 'lucide-react';

const iconMap = {
  Pointer,
  TrendingUp,
  Minus,
  ArrowUpRight,
  MoveVertical,
  PenTool,
  Square,
  Sliders,
  Maximize2,
  Share2,
  ArrowUpCircle,
  ArrowDownCircle,
  Ruler,
};

export const getTimeframeSeconds = (timeframe) => {
  switch (timeframe) {
    case '1m': return 60;
    case '5m': return 300;
    case '15m': return 900;
    case '30m': return 1800;
    case '1H': return 3600;
    case '4H': return 14400;
    case '1D': return 86400;
    case '1W': return 604800;
    default: return 3600;
  }
};

export const getTimeframeBucket = (timestampInSecOrMs, timeframe) => {
  let sec = typeof timestampInSecOrMs === 'number'
    ? timestampInSecOrMs
    : Math.floor(Date.now() / 1000);

  if (sec > 1000000000000) {
    sec = Math.floor(sec / 1000);
  }

  const tfSec = getTimeframeSeconds(timeframe);

  if (timeframe === '1D') {
    const d = new Date(sec * 1000);
    return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
  } else if (timeframe === '1W') {
    const d = new Date(sec * 1000);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day;
    return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff) / 1000);
  }

  return Math.floor(sec / tfSec) * tfSec;
};

export const TradingViewChart = ({
  symbol = 'EUR/USD',
  height = 540,
  activePositions = [],
  onQuickTrade,
}) => {
  const { currentQuote, selectedSymbol } = useMarket();
  const activeSymbol = symbol || selectedSymbol || 'EUR/USD';

  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverData, setHoverData] = useState(null);

  // Active Drawing Tool
  const [activeDrawingTool, setActiveDrawingTool] = useState('cursor');

  // Indicators State
  const [activeIndicators, setActiveIndicators] = useState({
    sma20: true,
    ema50: true,
    rsi: false,
    macd: false,
    bollinger: false,
    vwap: false,
    atr: false,
    stochastic: false,
    volume: true,
  });
  const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);

  // DOM & Chart Refs
  const containerRef = useRef(null);
  const chartWrapperRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const currentLiveCandleRef = useRef(null);

  // Indicator Series Refs
  const indicatorSeriesRefs = useRef({});
  const positionPriceLinesRef = useRef([]);

  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];

  // ==========================================
  // 1. DATA FETCHING
  // ==========================================
  const fetchCandles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await marketAPI.getHistory(activeSymbol, timeframe, 300);
      if (res && res.success && Array.isArray(res.data)) {
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
        currentLiveCandleRef.current = unique.length > 0 ? { ...unique[unique.length - 1] } : null;
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
  // 2. CHART INITIALIZATION
  // ==========================================
  useEffect(() => {
    if (!containerRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#090D16' },
        textColor: '#94A3B8',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.45)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(30, 41, 59, 0.45)', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#F59E0B',
          width: 1,
          style: LineStyle.Dashed,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: '#1E293B',
        },
        horzLine: {
          color: '#F59E0B',
          width: 1,
          style: LineStyle.Dashed,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: '#1E293B',
        },
      },
      rightPriceScale: {
        borderColor: '#1E293B',
        scaleMargins: { top: 0.1, bottom: 0.2 },
        autoScale: true,
        alignLabels: true,
      },
      timeScale: {
        borderColor: '#1E293B',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 10,
        minBarSpacing: 1,
        fixLeftEdge: false,
        fixRightEdge: false,
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
        axisDoubleClickReset: true,
      },
    });

    chartInstanceRef.current = chart;

    // Create Main Series based on Chart Type
    let mainSeries;
    if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, {
        color: '#F59E0B',
        lineWidth: 2,
        priceLineColor: '#F59E0B',
      });
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(245, 158, 11, 0.4)',
        bottomColor: 'rgba(245, 158, 11, 0.0)',
        lineColor: '#F59E0B',
        lineWidth: 2,
      });
    } else if (chartType === 'bar') {
      mainSeries = chart.addSeries(BarSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
      });
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
        borderUpColor: '#10B981',
        borderDownColor: '#EF4444',
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
      });
    }
    mainSeriesRef.current = mainSeries;

    // Volume Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#3B82F6',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    // Subscribe to Crosshair Moves for OHLC display
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData || param.point === undefined) {
        setHoverData(null);
        return;
      }
      const data = param.seriesData.get(mainSeries);
      if (data) {
        setHoverData(data);
      }
    });

    // Resize observer
    const handleResize = () => {
      if (containerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [chartType, height]);

  // ==========================================
  // 3. UPDATE CANDLES & INDICATORS
  // ==========================================
  useEffect(() => {
    if (!mainSeriesRef.current || candles.length === 0) return;

    if (chartType === 'line' || chartType === 'area') {
      const lineData = candles.map((c) => ({ time: c.time, value: c.close }));
      mainSeriesRef.current.setData(lineData);
    } else {
      mainSeriesRef.current.setData(candles);
    }

    // Volume
    if (volumeSeriesRef.current) {
      if (activeIndicators.volume) {
        const volData = candles.map((c) => ({
          time: c.time,
          value: c.volume || 1000,
          color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        }));
        volumeSeriesRef.current.setData(volData);
      } else {
        volumeSeriesRef.current.setData([]);
      }
    }

    const chart = chartInstanceRef.current;
    if (!chart) return;

    // Remove existing indicator series before re-adding
    Object.values(indicatorSeriesRefs.current).forEach((series) => {
      try {
        if (series) chart.removeSeries(series);
      } catch (e) {
        // ignore
      }
    });
    indicatorSeriesRefs.current = {};

    // SMA 20
    if (activeIndicators.sma20) {
      const smaData = calculateSMA(candles, 20);
      if (smaData.length > 0) {
        const s = chart.addSeries(LineSeries, {
          color: '#38BDF8',
          lineWidth: 2,
          title: 'SMA 20',
          priceLineVisible: false,
        });
        s.setData(smaData);
        indicatorSeriesRefs.current.sma20 = s;
      }
    }

    // EMA 50
    if (activeIndicators.ema50) {
      const emaData = calculateEMA(candles, 50);
      if (emaData.length > 0) {
        const s = chart.addSeries(LineSeries, {
          color: '#F59E0B',
          lineWidth: 2,
          title: 'EMA 50',
          priceLineVisible: false,
        });
        s.setData(emaData);
        indicatorSeriesRefs.current.ema50 = s;
      }
    }

    // Bollinger Bands
    if (activeIndicators.bollinger) {
      const bb = calculateBollingerBands(candles, 20, 2);
      if (bb.upper.length > 0) {
        const u = chart.addSeries(LineSeries, { color: 'rgba(168, 85, 247, 0.7)', lineWidth: 1, title: 'BB Upper' });
        const m = chart.addSeries(LineSeries, { color: 'rgba(168, 85, 247, 0.4)', lineWidth: 1, lineStyle: LineStyle.Dotted });
        const l = chart.addSeries(LineSeries, { color: 'rgba(168, 85, 247, 0.7)', lineWidth: 1, title: 'BB Lower' });
        u.setData(bb.upper);
        m.setData(bb.middle);
        l.setData(bb.lower);
        indicatorSeriesRefs.current.bbUpper = u;
        indicatorSeriesRefs.current.bbMiddle = m;
        indicatorSeriesRefs.current.bbLower = l;
      }
    }

    // VWAP
    if (activeIndicators.vwap) {
      const vwapData = calculateVWAP(candles);
      if (vwapData.length > 0) {
        const s = chart.addSeries(LineSeries, {
          color: '#EC4899',
          lineWidth: 2,
          title: 'VWAP',
          priceLineVisible: false,
        });
        s.setData(vwapData);
        indicatorSeriesRefs.current.vwap = s;
      }
    }
    // Initialize current live candle reference
    if (candles.length > 0) {
      currentLiveCandleRef.current = { ...candles[candles.length - 1] };
    }

    // Auto-fit content on historical candles reload
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().fitContent();
    }
  }, [candles, chartType, activeIndicators]);

  // ==========================================
  // 4. LIVE PRICE TICK UPDATE & CANDLE AGGREGATION
  // ==========================================
  useEffect(() => {
    if (!mainSeriesRef.current || !currentQuote) return;
    if (currentQuote.symbol !== activeSymbol) return;

    const livePrice = currentQuote.price;
    if (typeof livePrice !== 'number' || isNaN(livePrice) || livePrice <= 0) return;

    // Normalize incoming tick timestamp to integer seconds
    let rawTime = Date.now();
    if (currentQuote.lastUpdated) {
      const parsed = new Date(currentQuote.lastUpdated).getTime();
      if (!isNaN(parsed) && parsed > 0) rawTime = parsed;
    }
    const tickTimeSec = Math.floor(rawTime / 1000);
    const bucketTime = getTimeframeBucket(tickTimeSec, timeframe);

    const activeLiveCandle = currentLiveCandleRef.current;

    if (!activeLiveCandle || bucketTime > activeLiveCandle.time) {
      // A NEW timeframe candle period has begun!
      const prevClose = activeLiveCandle ? activeLiveCandle.close : livePrice;
      const newCandle = {
        time: bucketTime,
        open: prevClose,
        high: Math.max(prevClose, livePrice),
        low: Math.min(prevClose, livePrice),
        close: livePrice,
        volume: 100,
      };

      currentLiveCandleRef.current = newCandle;

      if (chartType === 'line' || chartType === 'area') {
        mainSeriesRef.current.update({ time: newCandle.time, value: livePrice });
      } else {
        mainSeriesRef.current.update(newCandle);
      }

      if (volumeSeriesRef.current && activeIndicators.volume) {
        volumeSeriesRef.current.update({
          time: newCandle.time,
          value: newCandle.volume,
          color: newCandle.close >= newCandle.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        });
      }
    } else {
      // SAME timeframe bucket: update current active candle
      const updatedCandle = {
        ...activeLiveCandle,
        high: Math.max(activeLiveCandle.high, livePrice),
        low: Math.min(activeLiveCandle.low, livePrice),
        close: livePrice,
        volume: (activeLiveCandle.volume || 1000) + 10,
      };

      currentLiveCandleRef.current = updatedCandle;

      if (chartType === 'line' || chartType === 'area') {
        mainSeriesRef.current.update({ time: updatedCandle.time, value: livePrice });
      } else {
        mainSeriesRef.current.update(updatedCandle);
      }

      if (volumeSeriesRef.current && activeIndicators.volume) {
        volumeSeriesRef.current.update({
          time: updatedCandle.time,
          value: updatedCandle.volume,
          color: updatedCandle.close >= updatedCandle.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        });
      }
    }
  }, [currentQuote, activeSymbol, chartType, timeframe, activeIndicators.volume]);

  // Fit content
  const handleReset = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().fitContent();
    }
  };

  const handleScrollToLatest = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().scrollToRealTime();
    }
  };

  const toggleFullscreen = () => {
    if (!chartWrapperRef.current) return;
    if (!isFullscreen) {
      if (chartWrapperRef.current.requestFullscreen) {
        chartWrapperRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleIndicator = (key) => {
    setActiveIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeQuote = currentQuote?.symbol === activeSymbol ? currentQuote : null;
  const currentPrice = activeQuote ? activeQuote.price : candles[candles.length - 1]?.close;

  return (
    <div
      ref={chartWrapperRef}
      className={`glass-panel rounded-2xl border border-slate-800 bg-[#090D16] flex flex-col overflow-hidden relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-slate-800/80 bg-slate-950/80 text-xs font-mono">
        {/* Symbol & Price Badge */}
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-white font-['Outfit'] tracking-wide">{activeSymbol}</span>
          <span className="text-kkn-gold font-bold text-sm bg-kkn-gold/10 px-2.5 py-0.5 rounded border border-kkn-gold/30">
            {currentPrice ? currentPrice.toFixed(4) : '—'}
          </span>
          {activeQuote && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                activeQuote.change24 >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {activeQuote.change24 >= 0 ? `+${activeQuote.change24}%` : `${activeQuote.change24}%`}
            </span>
          )}
          {isLiveFeed && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                timeframe === tf ? 'bg-kkn-gold text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Types & Indicator Controls */}
        <div className="flex items-center gap-2">
          {/* Chart Type */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['candlestick', 'line', 'area', 'bar'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  chartType === type ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIndicatorMenuOpen(!indicatorMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-kkn-gold" />
              <span>Indicators</span>
            </button>

            {indicatorMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-40 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 pb-1 border-b border-slate-800">
                  Toggle Technical Indicators
                </div>
                {[
                  { key: 'sma20', name: 'SMA 20 (Simple MA)' },
                  { key: 'ema50', name: 'EMA 50 (Exponential)' },
                  { key: 'bollinger', name: 'Bollinger Bands' },
                  { key: 'vwap', name: 'VWAP (Volume Weighted)' },
                  { key: 'volume', name: 'Volume Histogram' },
                ].map((ind) => (
                  <button
                    key={ind.key}
                    onClick={() => toggleIndicator(ind.key)}
                    className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-900 text-slate-300 text-left transition-colors"
                  >
                    <span>{ind.name}</span>
                    {activeIndicators[ind.key] ? (
                      <Eye className="w-3.5 h-3.5 text-kkn-gold" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Latest / Scroll to Real-time */}
          <button
            onClick={handleScrollToLatest}
            title="Go to Latest Candle"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-kkn-gold hover:text-white border border-slate-800 text-xs font-bold transition-all"
          >
            <span>Latest →</span>
          </button>

          {/* Reset / Auto-Fit View */}
          <button
            onClick={handleReset}
            title="Auto-Fit Historical Candles"
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Area with Left Drawing Toolbar + Center Chart */}
      <div className="flex-1 flex relative">
        {/* Left Drawing Toolbar */}
        <div className="w-12 border-r border-slate-800/80 bg-slate-950/90 flex flex-col items-center py-2 gap-1.5 z-30 shrink-0">
          {DRAWING_TOOLS.map((tool) => {
            const IconComp = iconMap[tool.icon] || Pointer;
            const isSelected = activeDrawingTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveDrawingTool(tool.id)}
                title={tool.name}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-kkn-gold text-slate-950 shadow-gold-sm scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Chart Canvas & SVG Overlay */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: `${height}px` }}>
          {/* OHLCV Crosshair Hover Bar */}
          {hoverData && (
            <div className="absolute top-2 left-3 z-10 flex items-center gap-3 text-[11px] font-mono bg-slate-950/90 px-3 py-1 rounded-lg border border-slate-800 pointer-events-none backdrop-blur-md shadow-lg">
              <span className="text-slate-400">
                O: <strong className="text-white">{hoverData.open !== undefined ? hoverData.open.toFixed(4) : (hoverData.value !== undefined ? hoverData.value.toFixed(4) : '—')}</strong>
              </span>
              <span className="text-slate-400">
                H: <strong className="text-emerald-400">{hoverData.high !== undefined ? hoverData.high.toFixed(4) : '—'}</strong>
              </span>
              <span className="text-slate-400">
                L: <strong className="text-rose-400">{hoverData.low !== undefined ? hoverData.low.toFixed(4) : '—'}</strong>
              </span>
              <span className="text-slate-400">
                C: <strong className="text-kkn-gold">{hoverData.close !== undefined ? hoverData.close.toFixed(4) : (hoverData.value !== undefined ? hoverData.value.toFixed(4) : '—')}</strong>
              </span>
            </div>
          )}

          {/* Lightweight Charts DOM Container */}
          <div ref={containerRef} className="w-full h-full min-h-[480px]" style={{ pointerEvents: 'auto' }} />

          {/* SVG Interactive Drawing Layer */}
          <DrawingToolsLayer
            chartInstance={chartInstanceRef.current}
            seriesInstance={mainSeriesRef.current}
            symbol={activeSymbol}
            timeframe={timeframe}
            activeTool={activeDrawingTool}
            onToolSelect={setActiveDrawingTool}
            width={containerRef.current?.clientWidth}
            height={height}
          />
        </div>
      </div>
    </div>
  );
};
