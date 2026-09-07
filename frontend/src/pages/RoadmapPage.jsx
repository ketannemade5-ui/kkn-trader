import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Globe,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  Brain,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const RoadmapPage = () => {
  const steps = [
    {
      num: 1,
      title: 'Trading Basics & Mechanics',
      desc: 'Master currency pairs, base vs quote, bid/ask spreads, pips, lots (standard, mini, micro), leverage, and margin.',
      link: '/learn/trading-basics',
      tag: 'Foundation',
    },
    {
      num: 2,
      title: 'Market Participants & Sessions',
      desc: 'Understand who moves the markets: Central banks, market makers, hedge funds, and the Asian, London, and New York killzones.',
      link: '/learn/market-basics',
      tag: 'Environment',
    },
    {
      num: 3,
      title: 'Japanese Candlesticks & Charts',
      desc: 'Learn single & multi-candle anatomy (Doji, Hammer, Engulfing) and read multi-timeframe price charts cleanly.',
      link: '/learn/candlesticks-and-charts',
      tag: 'Chart Reading',
    },
    {
      num: 4,
      title: 'Technical Analysis & Key Zones',
      desc: 'Identify dynamic support & resistance, trendlines, channels, breakouts, Moving Averages, and RSI momentum.',
      link: '/learn/technical-analysis',
      tag: 'Technical',
    },
    {
      num: 5,
      title: 'Price Action & Market Structure',
      desc: 'Master pure market structure: Higher Highs (HH), Higher Lows (HL), Lower Lows (LL), BOS, and CHoCH reversals.',
      link: '/learn/price-action',
      tag: 'Structure',
    },
    {
      num: 6,
      title: 'SMC & Institutional Liquidity',
      desc: 'Discover Buy-Side & Sell-Side Liquidity (BSL/SSL), liquidity sweeps, Order Blocks, and Fair Value Gaps (FVG).',
      link: '/learn/smc-ict-concepts',
      tag: 'Smart Money',
    },
    {
      num: 7,
      title: 'The 1% Mathematical Risk Rule',
      desc: 'Strict capital preservation: Never risk more than 1-2% per trade, size lots strictly from stop loss, and eliminate risk of ruin.',
      link: '/learn/risk-management',
      tag: 'Risk Management',
    },
    {
      num: 8,
      title: 'Trading Psychology & Mindset',
      desc: 'Conquer revenge trading, FOMO, fear, and greed. Cultivate emotional composure and professional discipline.',
      link: '/learn/trading-psychology',
      tag: 'Psychology',
    },
    {
      num: 9,
      title: 'Strategy Formulation & Backtesting',
      desc: 'Build a rule-based plan with positive mathematical expectancy. Test historical setups in the KKN Backtesting Lab.',
      link: '/backtest',
      tag: 'Strategy',
    },
    {
      num: 10,
      title: 'Simulated Paper Trading ($10k Demo)',
      desc: 'Execute virtual orders in the institutional terminal, log notes in the trading journal, and track your equity growth curve.',
      link: '/trade',
      tag: 'Live Execution',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
          <Compass className="w-4 h-4" />
          SYSTEMATIC 10-STEP PROGRESSION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          The Beginner Trading Roadmap
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          Follow this systematic career roadmap to build institutional competence before risking real financial capital.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800 before:z-0">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={step.num}
              className={`relative z-10 flex flex-col sm:flex-row items-start gap-6 ${
                isEven ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Content Card */}
              <div className="w-full sm:w-1/2">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40">
                      STEP {step.num} • {step.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">L{step.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={step.link}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-kkn-gold hover:underline"
                    >
                      <span>Study Milestone</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Number Circle Marker */}
              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-kkn-gold flex items-center justify-center text-kkn-gold font-mono font-black text-sm shadow-gold-sm shrink-0 self-start sm:self-center hidden sm:flex">
                {step.num}
              </div>

              {/* Empty placeholder for grid balance on desktop */}
              <div className="hidden sm:block w-1/2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
