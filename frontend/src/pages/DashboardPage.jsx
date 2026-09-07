import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePaperTrading } from '../context/PaperTradingContext';
import { useMarket } from '../context/MarketContext';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  TrendingUp,
  PieChart,
  BookMarked,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { portfolio, positions } = usePaperTrading();
  const { quotes } = useMarket();

  const isPositiveToday = (portfolio?.todayPL || 0) >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-kkn-gold/30 shadow-gold-glow relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            INSTITUTIONAL TRADER HUB
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Welcome back, {user?.name || 'Trader'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your simulated practice equity, resume academy modules, and execute disciplined price action setups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/trade"
            className="px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Open Trading Terminal
          </Link>
          <Link
            to="/learn"
            className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-kkn-gold text-white font-bold text-xs flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-kkn-gold" />
            Continue Academy
          </Link>
        </div>
      </div>

      {/* Account KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Virtual Equity</span>
          <p className="text-2xl font-black text-kkn-gold">
            ${(portfolio?.equity || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Balance: ${(portfolio?.balance || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Today's Realized P/L</span>
          <p className={`text-2xl font-black ${isPositiveToday ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveToday ? '+' : ''}${(portfolio?.todayPL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Total Realized: ${(portfolio?.realizedPL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Win Rate</span>
          <p className="text-2xl font-black text-white">
            {portfolio?.winRate || 0}%
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {portfolio?.winningTrades || 0} Wins / {portfolio?.losingTrades || 0} Losses
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Active Positions</span>
          <p className="text-2xl font-black text-white">
            {positions?.length || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Floating: ${(portfolio?.floatingPL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Quick Actions & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Learning Module */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-kkn-gold uppercase">Recommended Lesson</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">Level 6</span>
          </div>

          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Understanding Market Liquidity & Sweeps
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Learn how institutional participants accumulate buy and sell positions around equal highs and equal lows.
          </p>

          <Link
            to="/learn/smc-ict-concepts/understanding-market-liquidity-and-sweeps"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-kkn-gold hover:underline pt-2"
          >
            <span>Resume Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Paper Trading Status */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Live Practice Session</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">1:100 Model</span>
          </div>

          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Execute Risk-Managed Paper Trades
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Open the 3-column institutional terminal to simulate orders on XAU/USD, EUR/USD, GBP/USD, and NASDAQ.
          </p>

          <Link
            to="/trade"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:underline pt-2"
          >
            <span>Launch Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Ask KKN AI Prompt Bar */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">AI Learning Assistant</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>

          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Have a Question on Price Action?
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Ask KKN AI to explain Break of Structure, Order Blocks, Fair Value Gaps, or the 1% risk formula.
          </p>

          <Link
            to="/ai"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 hover:underline pt-2"
          >
            <span>Ask KKN AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
