import React, { useState, useEffect } from 'react';
import { portfolioAPI, paperTradingAPI } from '../services/api';
import { EquityChart } from '../components/charts/EquityChart';
import { useAuth } from '../context/AuthContext';
import {
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Award,
  Activity,
  Target,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';

export const PortfolioPage = () => {
  const [summary, setSummary] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const [sumRes, histRes] = await Promise.allSettled([
          portfolioAPI.getSummary(),
          paperTradingAPI.getHistory(),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.success) {
          setSummary(sumRes.value.data);
        }
        if (histRes.status === 'fulfilled' && histRes.value.success) {
          setTrades(histRes.value.data || []);
        }
      } catch (err) {
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const p = summary || {
    balance: 100000,
    equity: 100000,
    usedMargin: 0,
    availableMargin: 100000,
    floatingPL: 0,
    realizedPL: 0,
    todayPL: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    profitFactor: 0,
    expectancy: 0,
    avgWin: 0,
    avgLoss: 0,
    avgRR: 0,
    largestWin: 0,
    largestLoss: 0,
    equityHistory: [],
  };

  const isProfit = (p.realizedPL || 0) >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold mb-2">
            <PieIcon className="w-3.5 h-3.5" />
            VIRTUAL PORTFOLIO ANALYTICS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Portfolio & Account Metrics
          </h1>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
          Account Status: <strong className="text-emerald-400">ACTIVE SIMULATION</strong>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 font-mono">
          <span className="text-xs text-slate-400 block mb-1">Virtual Balance</span>
          <p className="text-2xl font-black text-white">
            ${p.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Initial: $100,000.00</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-kkn-gold/40 shadow-gold-sm font-mono">
          <span className="text-xs text-kkn-gold block mb-1 font-bold">Total Equity</span>
          <p className="text-2xl font-black text-white">
            ${p.equity?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Floating: {p.floatingPL >= 0 ? '+' : ''}${p.floatingPL}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 font-mono">
          <span className="text-xs text-slate-400 block mb-1">Net Realized P/L</span>
          <p className={`text-2xl font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? '+' : ''}${p.realizedPL?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Total Trades: {p.totalTrades}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 font-mono">
          <span className="text-xs text-slate-400 block mb-1">Win Rate</span>
          <p className="text-2xl font-black text-white">
            {p.winRate}%
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {p.winningTrades}W / {p.losingTrades}L
          </span>
        </div>
      </div>

      {/* Equity Curve Chart */}
      <EquityChart history={p.equityHistory} height={320} />

      {/* Institutional Statistics Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-kkn-gold" />
          Institutional Edge & Expectancy Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Profit Factor</span>
            <span className="text-lg font-bold text-emerald-400">{p.profitFactor || '0.00'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Expectancy / Trade</span>
            <span className={`text-lg font-bold ${p.expectancy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${p.expectancy || '0.00'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Average Win</span>
            <span className="text-lg font-bold text-emerald-400">+${p.avgWin || '0.00'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Average Loss</span>
            <span className="text-lg font-bold text-rose-400">-${p.avgLoss || '0.00'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Average R:R</span>
            <span className="text-lg font-bold text-kkn-gold">1:{p.avgRR || '0.0'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Largest Win</span>
            <span className="text-lg font-bold text-emerald-400">+${p.largestWin || '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
