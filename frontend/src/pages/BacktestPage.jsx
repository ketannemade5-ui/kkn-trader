import React, { useState, useEffect } from 'react';
import { backtestAPI } from '../services/api';
import {
  History,
  Play,
  SkipForward,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const BacktestPage = () => {
  const [symbol, setSymbol] = useState('XAU/USD');
  const [timeframe, setTimeframe] = useState('15m');
  const [allCandles, setAllCandles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(40);
  const [loading, setLoading] = useState(true);
  const [simTrades, setSimTrades] = useState([]);

  const fetchBacktestSession = async () => {
    setLoading(true);
    try {
      const res = await backtestAPI.getSession({ symbol, timeframe, limit: 120 });
      if (res.success && res.historicalCandles) {
        const full = [...res.historicalCandles, ...res.unrevealedCandles];
        setAllCandles(full);
        setVisibleCount(res.historicalCandles.length);
        setSimTrades([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBacktestSession();
  }, [symbol, timeframe]);

  const handleNextCandle = () => {
    if (visibleCount < allCandles.length) {
      setVisibleCount((prev) => prev + 1);
    }
  };

  const handleSimOrder = (side) => {
    const currentCandle = allCandles[visibleCount - 1];
    if (!currentCandle) return;

    setSimTrades((prev) => [
      ...prev,
      {
        id: Date.now(),
        candleIndex: visibleCount,
        side,
        entryPrice: currentCandle.close,
        time: currentCandle.dateStr,
      },
    ]);
  };

  const visibleCandles = allCandles.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            HISTORICAL SIMULATION MODE
          </div>
          <h1 className="text-3xl font-black text-white font-['Outfit']">
            Backtesting Practice Lab
          </h1>
          <p className="text-xs text-slate-400">
            Step through historical price action candle-by-candle to practice identifying setups before they unfold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold"
          >
            <option value="XAU/USD">XAU/USD (Gold)</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="BTC/USD">BTC/USD</option>
          </select>

          <button
            onClick={fetchBacktestSession}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-kkn-gold text-slate-400 hover:text-white"
            title="Reset Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulator Control Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Revealed: <strong className="text-kkn-gold">{visibleCount}</strong> / {allCandles.length} Candles
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimOrder('BUY')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-md"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Simulate BUY
          </button>

          <button
            onClick={() => handleSimOrder('SELL')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-md"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Simulate SELL
          </button>

          <button
            onClick={handleNextCandle}
            disabled={visibleCount >= allCandles.length}
            className="px-5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Next Candle</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Candlestick Visualizer Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 min-h-[380px] shadow-2xl relative flex flex-col justify-end">
        <div className="flex items-end gap-2 overflow-x-auto pb-4 h-72">
          {visibleCandles.map((c, idx) => {
            const isBull = c.close >= c.open;
            return (
              <div key={idx} className="flex flex-col items-center shrink-0 w-4 h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="hidden group-hover:block absolute bottom-full mb-2 z-30 p-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-200 whitespace-nowrap shadow-xl">
                  O: {c.open} | H: {c.high} | L: {c.low} | C: {c.close}
                </div>

                {/* Body and wick */}
                <div
                  className={`w-1.5 rounded-sm transition-all ${
                    isBull ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{
                    height: `${Math.max(4, Math.abs(c.close - c.open) * 5)}px`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Simulation Playback: {symbol} • {timeframe}</span>
          <span>Zero Real Funds • Educational Practice</span>
        </div>
      </div>

      {/* Simulated Orders List */}
      {simTrades.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white">Simulated Practice Orders</h3>
          <div className="space-y-2">
            {simTrades.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {t.side}
                  </span>
                  <span className="text-white">Entered @ {t.entryPrice}</span>
                </div>
                <span className="text-slate-400">Candle #{t.candleIndex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
