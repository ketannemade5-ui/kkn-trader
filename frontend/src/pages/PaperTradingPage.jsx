import React from 'react';
import { useMarket } from '../context/MarketContext';
import { usePaperTrading } from '../context/PaperTradingContext';
import { TradingChart } from '../components/charts/TradingChart';
import { OrderPanel } from '../components/trading/OrderPanel';
import { PositionsTable } from '../components/trading/PositionsTable';
import { WatchlistSidebar } from '../components/trading/WatchlistSidebar';
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Shield,
  PieChart,
  HelpCircle,
  Activity,
  Terminal,
} from 'lucide-react';

export const PaperTradingPage = () => {
  const { selectedSymbol, currentQuote } = useMarket();
  const { portfolio, positions, resetAccount } = usePaperTrading();

  const isFloatingProfit = (portfolio?.floatingPL || 0) >= 0;

  return (
    <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Simulation Header & Virtual Account Stats Bar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Terminal Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kkn-gold/20 border border-kkn-gold/40 flex items-center justify-center text-kkn-gold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white font-['Outfit']">
                Trading Terminal & Market Execution
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40">
                $100,000 ACCOUNT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Professional execution workstation with live market data feeds
            </p>
          </div>
        </div>

        {/* Right: Account Metrics Chips */}
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">ACCOUNT BALANCE</span>
            <span className="text-sm font-bold text-white">
              ${(portfolio?.balance || portfolio?.virtualBalance || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">TOTAL EQUITY</span>
            <span className="text-sm font-bold text-kkn-gold">
              ${(portfolio?.equity || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">UNREALIZED P/L</span>
            <span
              className={`text-sm font-bold ${
                isFloatingProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isFloatingProfit ? '+' : ''}$
              {(portfolio?.floatingPL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hidden sm:block">
            <span className="text-[10px] text-slate-500 block">FREE MARGIN</span>
            <span className="text-sm font-bold text-slate-300">
              ${(portfolio?.availableMargin || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Reset Demo Account Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset virtual trading account back to initial $100,000.00 starting balance?')) {
                resetAccount();
              }
            }}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
            title="Reset Trading Account to $100,000.00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Institutional Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1: Watchlist & Instrument Switcher (3 cols) */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <WatchlistSidebar />
        </div>

        {/* Column 2: TradingView Candlestick Chart Engine (6 cols) */}
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <TradingChart
            symbol={selectedSymbol}
            height={520}
            activePositions={positions}
          />
        </div>

        {/* Column 3: Order Execution Panel (3 cols) */}
        <div className="lg:col-span-3 order-3">
          <OrderPanel />
        </div>
      </div>

      {/* Bottom Row: Positions, Orders & Trade History */}
      <div className="w-full">
        <PositionsTable />
      </div>
    </div>
  );
};
