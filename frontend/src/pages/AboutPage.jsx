import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Instagram,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
          <Award className="w-4 h-4" />
          ABOUT KKN TRADER
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-['Outfit']">
          Democratizing Institutional Trading Education
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          "Learn the Market. Practice the Trade. Master the Skill."
        </p>
      </div>

      {/* Brand Mission Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-kkn-gold/30 shadow-gold-glow space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <img
            src="/assets/logo.png"
            alt="KKN TRADER Brand Logo"
            className="h-16 w-auto object-contain rounded-lg shadow-md"
          />
          <div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">The KKN Trader Vision</h2>
            <p className="text-xs text-kkn-gold font-mono">Institutional Financial Education & Practice</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            KKN Trader was created with a straightforward mission: to provide everyday traders and aspiring financial students with a structured, institutional curriculum and risk-free simulation environment.
          </p>
          <p>
            Rather than chasing get-rich-quick schemes or indicator overload, we focus on what really works in global markets: <strong>Market Structure, Liquidity Pools, Fair Value Gaps, and Strict 1% Mathematical Risk Management</strong>.
          </p>
          <p>
            Every concept taught in our 20 Academy levels can be immediately practiced in our $100,000 virtual trading terminal and tracked in our automated trade journal.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-kkn-gold/20 text-kkn-gold flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit']">Structured Education</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Progress step-by-step from beginner terminology to advanced SMC models with comprehensive quizzes.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit']">Risk-Free Simulation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulate positions with virtual funds. Master execution psychology before considering live capital.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit']">Discipline & Integrity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero fake claims. Pure mathematical expectancy, transparent education, and responsible risk habits.
          </p>
        </div>
      </div>
    </div>
  );
};
