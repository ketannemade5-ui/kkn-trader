import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Star,
  Sparkles,
  BarChart2,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const MarketsPage = () => {
  const { quotes, setSelectedSymbol, watchlist, toggleWatchlist, refreshQuotes, loading } = useMarket();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Watchlist', 'Forex', 'Metals', 'Crypto', 'Indices', 'Commodities'];

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.symbol.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Watchlist') return watchlist.includes(q.symbol);
    return q.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleTrade = (sym) => {
    setSelectedSymbol(sym);
    navigate('/trade');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-widest">
              Near-Real-Time Quotes & Feed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Live Financial Markets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select an instrument to inspect historical candlestick charts or practice paper trading.
          </p>
        </div>

        <button
          onClick={refreshQuotes}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-kkn-gold flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Quotes
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-kkn-gold text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-kkn-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuotes.map((q) => {
          const isPos = (q.change24 || 0) >= 0;
          const isStarred = watchlist.includes(q.symbol);

          return (
            <div
              key={q.symbol}
              className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/50 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatchlist(q.symbol)}
                      className="text-slate-500 hover:text-kkn-gold transition-colors"
                      title="Toggle Watchlist"
                    >
                      <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {q.category}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold flex items-center ${
                      isPos ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3.5 h-3.5 mr-1 inline" /> : <TrendingDown className="w-3.5 h-3.5 mr-1 inline" />}
                    {isPos ? '+' : ''}{q.change24}%
                  </span>
                </div>

                {/* Symbol & Name */}
                <div className="mt-3">
                  <h3 className="text-xl font-black text-white font-mono group-hover:text-kkn-gold transition-colors">
                    {q.symbol}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{q.name}</p>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Price</span>
                    <span className="text-xl font-black text-white">
                      ${q.price?.toLocaleString('en-US', { minimumFractionDigits: q.digits || 2 })}
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    <span className="block">Bid: <strong className="text-slate-200">{q.bid}</strong></span>
                    <span className="block">Ask: <strong className="text-slate-200">{q.ask}</strong></span>
                  </div>
                </div>

                {/* 24h Range */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono text-slate-400">
                  <div className="p-2 rounded bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px]">24H HIGH</span>
                    <span className="text-emerald-400 font-bold">{q.high24?.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-500 block text-[10px]">24H LOW</span>
                    <span className="text-rose-400 font-bold">{q.low24?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleTrade(q.symbol)}
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Paper Trade
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
