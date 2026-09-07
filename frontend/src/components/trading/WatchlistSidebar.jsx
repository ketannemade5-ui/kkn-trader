import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
} from 'lucide-react';

export const WatchlistSidebar = () => {
  const { quotes, selectedSymbol, setSelectedSymbol, watchlist, toggleWatchlist } = useMarket();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Watchlist', 'Forex', 'Metals', 'Crypto', 'Indices'];

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.symbol.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Watchlist') return watchlist.includes(q.symbol);
    return q.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-3 h-full min-h-[450px]">
      {/* Search Header */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search symbol (e.g. Gold, EUR)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-kkn-gold focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-kkn-gold text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Instrument List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            No instruments found
          </div>
        ) : (
          filteredQuotes.map((q) => {
            const isSelected = q.symbol === selectedSymbol;
            const isStarred = watchlist.includes(q.symbol);
            const isPos = (q.change24 || 0) >= 0;

            return (
              <div
                key={q.symbol}
                onClick={() => setSelectedSymbol(q.symbol)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-800 border-kkn-gold/50 shadow-gold-sm'
                    : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(q.symbol);
                    }}
                    className="p-1 hover:text-kkn-gold transition-colors text-slate-500"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isStarred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  <div>
                    <span className="text-xs font-bold text-white font-mono block">
                      {q.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[90px] block">
                      {q.name}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-extrabold text-white block">
                    {q.price?.toLocaleString('en-US', { minimumFractionDigits: q.digits || 2 })}
                  </span>
                  <span
                    className={`text-[10px] font-bold flex items-center justify-end ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {q.change24}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
