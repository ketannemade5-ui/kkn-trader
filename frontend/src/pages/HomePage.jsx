import React from 'react';
import { Link } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Award,
  Cpu,
  Calculator,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  PieChart,
  Layers,
  Zap,
  DollarSign,
  Instagram,
  Compass,
} from 'lucide-react';

export const HomePage = () => {
  const { quotes } = useMarket();

  // Snapshot featured instruments
  const snapshotSymbols = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'BTC/USD', 'NASDAQ', 'US30'];
  const snapshotQuotes = snapshotSymbols
    .map((sym) => quotes.find((q) => q.symbol === sym))
    .filter(Boolean);

  const academyCategories = [
    { title: 'Trading Basics', desc: 'Pips, standard lots, leverage, bid/ask spreads, and order execution.', icon: Compass, link: '/learn/trading-basics' },
    { title: 'Technical Analysis', desc: 'Support/resistance, trend channels, moving averages, and indicators.', icon: BarChart2, link: '/learn/technical-analysis' },
    { title: 'Price Action Mastery', desc: 'Market structure, Higher Highs, Higher Lows, and reversal confirmations.', icon: TrendingUp, link: '/learn/price-action' },
    { title: 'SMC / ICT Concepts', desc: 'Institutional order blocks, liquidity sweeps, BOS, CHoCH, and FVGs.', icon: Layers, link: '/learn/smc-ict-concepts' },
    { title: 'Fundamental Analysis', desc: 'Central banks, interest rate decisions, CPI inflation, and NFP data.', icon: Award, link: '/learn/fundamental-analysis' },
    { title: 'Risk Management (1%)', desc: 'The mathematical rules of capital preservation and position sizing.', icon: ShieldCheck, link: '/learn/risk-management' },
    { title: 'Trading Psychology', desc: 'Disciplined emotional control, conquering FOMO, and handling losses.', icon: Zap, link: '/learn/trading-psychology' },
    { title: 'Strategy Formulation', desc: 'Rule-based execution plans, positive expectancy, and backtesting.', icon: Cpu, link: '/learn/strategy-building' },
  ];

  const tradingCalculators = [
    { name: 'Position Size Calculator', desc: 'Calculate exact lots to strictly risk 1% per setup.', link: '/tools' },
    { name: 'Risk/Reward Calculator', desc: 'Ensure every trade has at least a 1:2 asymmetric payout.', link: '/tools' },
    { name: 'Pip Value Calculator', desc: 'Monetary value per pip across standard, mini, and micro lots.', link: '/tools' },
    { name: 'Lot Size Calculator', desc: 'Convert account risk and pip stop loss into exact lot sizes.', link: '/tools' },
    { name: 'Profit / Loss Calculator', desc: 'Accurate profit simulation before entering positions.', link: '/tools' },
    { name: 'Compounding Calculator', desc: 'Model long-term capital growth through disciplined returns.', link: '/tools' },
    { name: 'Margin Requirement Calculator', desc: 'Calculate required margin across 1:100 institutional leverage.', link: '/tools' },
  ];

  const roadmapSteps = [
    'Beginner Foundation',
    'Market Mechanics & Sessions',
    'Candlestick Anatomy',
    'Technical Analysis',
    'Price Action & Structure',
    'SMC & Liquidity Pools',
    '1% Risk Management',
    'Trading Psychology',
    'Strategy & Backtesting',
    'Paper Trading ($10k Demo)',
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16">
        {/* Glowing Background Candlesticks / Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-kkn-gold/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Logo Showcase with Institutional Glow */}
          <div className="inline-flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-kkn-gold/30 via-yellow-500/20 to-kkn-gold/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src="/assets/logo.png"
                alt="KKN TRADER Brand Identity"
                className="relative h-24 sm:h-32 w-auto object-contain drop-shadow-2xl rounded-xl border border-kkn-gold/40 shadow-gold-glow"
              />
            </div>
            <div className="mt-4 px-3.5 py-1 rounded-full bg-slate-900/90 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
              Official Institutional Platform • kkntrader.com
            </div>
          </div>

          {/* Headlines */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-['Outfit'] leading-none">
              Learn the Market.{' '}
              <span className="text-gold-gradient block sm:inline">Practice the Trade.</span>{' '}
              Master the Skill.
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Your complete platform to learn trading from zero, understand institutional market structure, practice with $100,000 virtual money, and build unshakeable trading discipline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/learn"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold text-slate-950 bg-gold-gradient shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Start Learning (12 Levels)
            </Link>

            <Link
              to="/trade"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-slate-900 border border-slate-700 hover:border-kkn-gold/50 hover:bg-slate-800 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-kkn-gold" />
              Try Paper Trading ($10k Demo)
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Risk-Free Virtual Funds
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Structured 12-Level Curriculum
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Smart Money & Price Action
            </span>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: LIVE MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
                Live / Near Real-Time Market Data
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Global Financial Market Snapshot
            </h2>
          </div>
          <Link
            to="/markets"
            className="text-xs font-bold text-kkn-gold hover:text-yellow-300 font-mono flex items-center gap-1"
          >
            <span>View All Instruments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(snapshotQuotes.length > 0 ? snapshotQuotes : quotes.slice(0, 4)).map((q) => {
            const isPos = (q.change24 || 0) >= 0;
            return (
              <div
                key={q.symbol}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-kkn-gold/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {q.category}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold flex items-center ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3.5 h-3.5 mr-1 inline" /> : <TrendingDown className="w-3.5 h-3.5 mr-1 inline" />}
                    {isPos ? '+' : ''}{q.change24}%
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white font-mono group-hover:text-kkn-gold transition-colors">
                    {q.symbol}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">{q.name}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-white font-mono">
                    ${q.price?.toLocaleString('en-US', { minimumFractionDigits: q.digits || 2 })}
                  </span>
                  <Link
                    to="/trade"
                    className="text-[11px] font-bold text-kkn-gold hover:underline font-mono"
                  >
                    Simulate Trade →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION B: WHY KKN TRADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
            The Institutional Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Why Learn & Practice on KKN Trader?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            90% of retail traders lose capital because they jump into real money without structured education or simulated practice. KKN Trader bridges the gap.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-kkn-gold/15 border border-kkn-gold/30 flex items-center justify-center text-kkn-gold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">1. Learn Step-by-Step</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Progress through 12 structured levels from basic pips and lots up to advanced SMC order blocks, liquidity models, and macroeconomic catalysts.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">2. Practice with $10k</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute realistic simulated BUY and SELL orders with dynamic Stop Loss and Take Profit limits. Zero financial risk. Virtual money only.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">3. Analyze Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track your simulated equity growth curve, win rate, expectancy, and automated trading journal logs to identify behavioral patterns.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">4. Master Discipline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn the 1% risk rule, eliminate revenge trading, calculate lot sizes scientifically, and develop the mental composure of an institutional trader.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION C: TRADING ACADEMY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
              Structured Curriculum
            </span>
            <h2 className="text-3xl font-black text-white font-['Outfit']">
              Trading Academy Categories
            </h2>
          </div>
          <Link
            to="/learn"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gold-gradient shadow-gold-sm hover:brightness-110 flex items-center gap-1.5"
          >
            <span>Explore Trading Academy (All 12 Levels)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {academyCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-kkn-gold/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-kkn-gold group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">L{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-white font-['Outfit'] group-hover:text-kkn-gold transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. SECTION D: PAPER TRADING TERMINAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-kkn-gold/30 shadow-gold-glow relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                VIRTUAL EXECUTION ENGINE
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                Institutional Paper Trading Terminal
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Test your trading strategies in live-like market conditions with zero capital at risk. Practice position sizing, calculate risk-to-reward ratios, and monitor automated journal entries.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono">
                  <span className="text-[11px] text-slate-400 block">Default Balance</span>
                  <span className="text-xl font-black text-white">$100,000.00</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono">
                  <span className="text-[11px] text-slate-400 block">Leverage Model</span>
                  <span className="text-xl font-black text-kkn-gold">1:100 Ratio</span>
                </div>
              </div>

              <Link
                to="/trade"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold text-slate-950 bg-gold-gradient shadow-gold-glow hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>Start Paper Trading Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mock Terminal Card */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 text-xs font-bold text-slate-300 font-mono">KKN Institutional Terminal</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SIMULATION ACTIVE
                </span>
              </div>

              {/* Mock Terminal Stats Row */}
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Symbol</span>
                  <span className="font-bold text-white">XAU/USD</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Type</span>
                  <span className="font-bold text-emerald-400">BUY 0.50L</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Entry</span>
                  <span className="font-bold text-slate-200">2,385.40</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Float P/L</span>
                  <span className="font-bold text-emerald-400">+$182.50</span>
                </div>
              </div>

              {/* Mock Mini Chart Display */}
              <div className="h-32 w-full bg-slate-900/60 rounded-xl border border-slate-800/80 p-3 flex items-end gap-1.5 justify-between">
                {[40, 55, 45, 60, 50, 70, 65, 80, 75, 95, 85, 100].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${
                        i % 2 === 0 ? 'bg-emerald-500/70' : 'bg-emerald-400'
                      }`}
                      style={{ height: `${val}%` }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Virtual Simulation: No real funds involved</span>
                <span className="text-kkn-gold font-bold">1:2.4 R:R Target Set</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION E: 7 TRADING TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
            Institutional Utilities
          </span>
          <h2 className="text-3xl font-black text-white font-['Outfit']">
            7 Professional Trading Calculators
          </h2>
          <p className="text-xs text-slate-400">
            Never guess your position size or margin requirements. Plan every trade with mathematical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tradingCalculators.map((tool) => (
            <Link
              key={tool.name}
              to={tool.link}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-kkn-gold/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white font-['Outfit'] group-hover:text-kkn-gold transition-colors mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center text-xs font-mono text-kkn-gold font-bold">
                <span>Launch Calculator →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. SECTION F: KKN AI ASSISTANT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                AI TRADING EDUCATION
              </div>

              <h2 className="text-3xl font-black text-white font-['Outfit']">
                KKN AI — Your Trading Learning Assistant
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Have a question about Liquidity, BOS, CHoCH, or Risk Management? Ask KKN AI for structured, beginner-friendly and institutional explanations.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed">
                <strong className="text-kkn-gold">Educational Guardrails:</strong> KKN AI is strictly educational and never provides financial advice or claims guaranteed returns.
              </div>

              <Link
                to="/ai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/30 transition-all"
              >
                <span>Ask KKN AI a Question</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Example Prompt Showcase */}
            <div className="lg:col-span-7 space-y-2.5">
              <span className="text-xs font-mono text-slate-400 font-bold block mb-1">
                Try asking questions like:
              </span>

              {[
                'What is liquidity and how do institutions hunt stops?',
                'What is the difference between BOS and CHoCH?',
                'How does an Order Block form and how is it mitigated?',
                'Explain the 1% risk rule and position sizing formula.',
                'Give me a complete beginner trading roadmap.',
              ].map((question) => (
                <Link
                  key={question}
                  to={`/ai?q=${encodeURIComponent(question)}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all group"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                    "{question}"
                  </span>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION G: LEARNING ROADMAP TRACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
            Career Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            The 10-Step Trader Roadmap
          </h2>
          <p className="text-xs text-slate-400">
            A systematic progression from an absolute beginner to an independent disciplined practitioner.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {roadmapSteps.map((step, idx) => (
            <div
              key={step}
              className="glass-card rounded-2xl p-4 text-center border border-slate-800 space-y-2 hover:border-kkn-gold/50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-kkn-gold/20 border border-kkn-gold/40 text-kkn-gold font-mono font-black text-xs flex items-center justify-center mx-auto">
                {idx + 1}
              </div>
              <h4 className="text-xs font-bold text-white font-['Outfit'] leading-tight">
                {step}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SECTION I: SOCIAL INSTAGRAM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-amber-950/60 border border-pink-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold font-mono">
              <Instagram className="w-3.5 h-3.5" />
              OFFICIAL COMMUNITY
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit']">
              Join the KKN Trader Community on Instagram
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Follow daily chart breakdowns, institutional trading psychology quotes, liquidity concepts, and market updates on our official channel.
            </p>
          </div>

          <a
            href="https://instagram.com/tradewith_kkn"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-8 py-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center gap-2"
          >
            <Instagram className="w-5 h-5" />
            <span>Follow @tradewith_kkn</span>
          </a>
        </div>
      </section>
    </div>
  );
};
