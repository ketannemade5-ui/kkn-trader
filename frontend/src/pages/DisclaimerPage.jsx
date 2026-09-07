import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DisclaimerPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          REGULATORY & EDUCATIONAL DISCLOSURE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          Educational & Simulation Disclaimer
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Last Updated: {new Date().getFullYear()} • KKN TRADER (kkntrader.com)
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono">
          <strong>IMPORTANT NOTICE:</strong> KKN Trader is strictly an educational learning platform and paper trading simulator. No actual monetary investments or broker order routings occur on this website.
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">1. Virtual Funds Only</h2>
          <p>
            All paper trading accounts on KKN Trader are funded with simulated virtual currency ($100,000 default balance). Virtual funds cannot be withdrawn, deposited, transferred, or converted into real monetary currency.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">2. No Financial Advice or Guarantees</h2>
          <p>
            Content, courses, lessons, quizzes, tools, and AI assistant responses provided on KKN Trader are for educational and informative purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice. Past performance on historical data or paper trading is no guarantee of future live market results.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">3. Market Data Notice</h2>
          <p>
            Market data displayed across charts and tickers may be near-real-time, delayed, or simulated for educational demonstrations. KKN Trader does not warrant the absolute accuracy or timeliness of any third-party market data feeds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">4. Risk of Financial Loss</h2>
          <p>
            Trading real financial markets (Forex, Metals, Commodities, Equities, Crypto) carries a high level of financial risk and may not be suitable for all individuals. Never trade with money you cannot afford to lose.
          </p>
        </section>
      </div>
    </div>
  );
};
