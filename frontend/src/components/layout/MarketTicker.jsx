import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketTicker = () => {
  const { quotes, setSelectedSymbol } = useMarket();
  const navigate = useNavigate();

  const handleSelect = (symbol) => {
    setSelectedSymbol(symbol);
    navigate(`/markets`);
  };

  if (!quotes || quotes.length === 0) return null;

  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800/80 overflow-hidden py-1.5 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-800 pr-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {quotes.map((q) => {
            const isPos = (q.change24 || 0) >= 0;
            return (
              <button
                key={q.symbol}
                onClick={() => handleSelect(q.symbol)}
                className="flex items-center gap-2 hover:bg-slate-800/60 px-2 py-0.5 rounded transition-all group"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-kkn-gold transition-colors font-mono">
                  {q.symbol}
                </span>
                <span className="text-xs font-semibold text-white font-mono">
                  {q.price?.toLocaleString('en-US', { minimumFractionDigits: q.digits || 2 })}
                </span>
                <span
                  className={`text-[11px] font-bold flex items-center font-mono ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  {isPos ? '+' : ''}
                  {q.change24}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
