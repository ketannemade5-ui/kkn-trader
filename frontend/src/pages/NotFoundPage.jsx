import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-kkn-gold/20 border-2 border-kkn-gold/40 flex items-center justify-center text-kkn-gold mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-black text-white font-['Outfit']">404 — Page Not Found</h1>
        <p className="text-xs text-slate-400">
          The chart or page you are looking for does not exist or has been relocated.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-gold-sm hover:brightness-110 transition-all"
        >
          <span>Return to KKN Trader</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
