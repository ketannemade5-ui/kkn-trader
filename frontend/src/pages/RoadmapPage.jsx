import React from 'react';
import { Link } from 'react-router-dom';
import { ACADEMY_LEVELS } from '../data/academyData';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const RoadmapPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
          <Compass className="w-4 h-4" />
          SYSTEMATIC 20-LEVEL CAREER ROADMAP
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          The Professional Trader Roadmap
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          Follow this structured 20-level institutional career progression to build mathematical competence, unshakeable psychological discipline, and a complete trading playbook before risking real capital.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800 before:z-0">
        {ACADEMY_LEVELS.map((level, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={level.id}
              className={`relative z-10 flex flex-col sm:flex-row items-start gap-6 ${
                isEven ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Content Card */}
              <div className="w-full sm:w-1/2">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40">
                      LEVEL {level.level} • {level.difficulty.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">L{level.level}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    {level.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {level.tagline || level.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {level.lessons?.length || 3} Lessons
                    </span>
                    <Link
                      to={`/academy/level/${level.level}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-kkn-gold hover:underline"
                    >
                      <span>Study Level</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Number Circle Marker */}
              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-kkn-gold flex items-center justify-center text-kkn-gold font-mono font-black text-sm shadow-gold-sm shrink-0 self-start sm:self-center hidden sm:flex">
                {level.level}
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
