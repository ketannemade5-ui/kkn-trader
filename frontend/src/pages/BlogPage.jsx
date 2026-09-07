import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import {
  Newspaper,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';

export const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'SMC',
    'Risk Management',
    'Price Action',
    'Forex',
    'Trading Psychology',
    'Beginner Guides',
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getPosts({ category, search });
        if (res.success && res.data) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
          <Newspaper className="w-4 h-4" />
          KNOWLEDGE BASE & RESEARCH DESK
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          Trading Insights & Research
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          In-depth articles on Smart Money Concepts, statistical expectancy, liquidity models, and macroeconomic catalysts written by the KKN research desk.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 bg-slate-900 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-kkn-gold text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search articles & concepts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-kkn-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          No articles match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/50 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMinutes || 5} min read
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-kkn-gold transition-colors leading-snug mb-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>By {post.author}</span>
                <span className="text-kkn-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
