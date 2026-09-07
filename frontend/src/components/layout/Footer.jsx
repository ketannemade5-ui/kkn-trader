import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Instagram, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-14 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/assets/logo.png"
                alt="KKN TRADER Brand Logo"
                className="h-10 w-auto object-contain rounded"
              />
              <span className="text-xl font-black text-white font-['Outfit'] tracking-wider">
                KKN <span className="text-gold-gradient">TRADER</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              "Learn the Market. Practice the Trade. Master the Skill."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier institutional trading academy and risk-free paper trading platform. Empowering everyday individuals with institutional price action and risk management mastery.
            </p>

            {/* Instagram Social Card */}
            <div className="pt-2">
              <a
                href="https://instagram.com/tradewith_kkn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-amber-900/30 border border-pink-500/30 text-white text-xs font-semibold hover:border-pink-500/60 hover:shadow-lg transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span>Follow on Instagram <strong className="text-pink-300 font-mono">@tradewith_kkn</strong></span>
                <ArrowUpRight className="w-3.5 h-3.5 text-pink-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Column 2: Academy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-kkn-gold">
              Trading Academy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/learn" className="hover:text-white transition-colors">12 Level Curriculum</Link></li>
              <li><Link to="/learn/trading-basics" className="hover:text-white transition-colors">Trading Basics</Link></li>
              <li><Link to="/learn/price-action" className="hover:text-white transition-colors">Price Action Mastery</Link></li>
              <li><Link to="/learn/smc-ict-concepts" className="hover:text-white transition-colors">SMC & Liquidity</Link></li>
              <li><Link to="/learn/risk-management" className="hover:text-white transition-colors">Risk Management (1% Rule)</Link></li>
              <li><Link to="/roadmap" className="hover:text-white transition-colors">Beginner Roadmap</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-kkn-gold">
              Platform & Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/trade" className="hover:text-white transition-colors">Paper Trading ($10k Demo)</Link></li>
              <li><Link to="/markets" className="hover:text-white transition-colors">Live Markets & Charts</Link></li>
              <li><Link to="/tools" className="hover:text-white transition-colors">7 Trading Calculators</Link></li>
              <li><Link to="/ai" className="hover:text-white transition-colors">KKN AI Learning Assistant</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Trading Journal</Link></li>
              <li><Link to="/backtest" className="hover:text-white transition-colors">Historical Backtesting</Link></li>
            </ul>
          </div>

          {/* Column 4: Institutional & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-kkn-gold">
              Legal & About
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About KKN Trader</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Educational Disclaimer</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] leading-relaxed text-slate-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">EDUCATIONAL AND SIMULATION PLATFORM ONLY:</strong> KKN TRADER (kkntrader.com) is an educational learning and simulation platform. All paper trading is conducted exclusively with simulated virtual funds ($100,000 demo account). No real money, deposits, or broker execution are ever involved. Market data is provided for practice purposes and may be simulated or delayed. KKN Trader does not provide financial advice, broker services, or guarantee investment profits.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} KKN TRADER (kkntrader.com). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/disclaimer" className="hover:text-slate-200">Disclaimer</Link>
            <Link to="/privacy" className="hover:text-slate-200">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
