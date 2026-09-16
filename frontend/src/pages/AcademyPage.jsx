import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ACADEMY_LEVELS } from '../data/academyData';
import { CourseCard } from '../components/academy/CourseCard';
import {
  getCompletedLessons,
  getLevelProgress,
  getOverallAcademyProgress,
  getLastOpenedLesson,
} from '../utils/academyProgress';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Trophy,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AcademyPage = () => {
  // Restore search/filter state from sessionStorage for seamless tab switching
  const [searchQuery, setSearchQuery] = useState(() => {
    try { return sessionStorage.getItem('kkn_academy_search') || ''; } catch { return ''; }
  });
  const [filterDifficulty, setFilterDifficulty] = useState(() => {
    try { return sessionStorage.getItem('kkn_academy_filter') || 'All'; } catch { return 'All'; }
  });
  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [lastOpened, setLastOpened] = useState(null);

  // Persist search/filter state whenever they change
  useEffect(() => {
    try { sessionStorage.setItem('kkn_academy_search', searchQuery); } catch {}
  }, [searchQuery]);

  useEffect(() => {
    try { sessionStorage.setItem('kkn_academy_filter', filterDifficulty); } catch {}
  }, [filterDifficulty]);

  useEffect(() => {
    const completed = getCompletedLessons();
    setCompletedSlugs(completed);
    setOverallProgress(getOverallAcademyProgress(ACADEMY_LEVELS));
    setLastOpened(getLastOpenedLesson());
  }, []);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Institutional Master'];

  const filteredLevels = ACADEMY_LEVELS.filter((level) => {
    // Difficulty filter
    if (filterDifficulty !== 'All' && level.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = level.title.toLowerCase().includes(q);
      const matchDesc = (level.description || '').toLowerCase().includes(q);
      const matchTagline = (level.tagline || '').toLowerCase().includes(q);
      const matchLessons = level.lessons?.some((l) => l.title.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTagline || matchLessons;
    }
    return true;
  });

  const totalLessons = ACADEMY_LEVELS.reduce((acc, l) => acc + (l.lessons?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-kkn-gold/30 shadow-gold-glow relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
            <GraduationCap className="w-4 h-4" />
            20-LEVEL STRUCTURED CURRICULUM
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
            KKN Trading Academy
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Designed to take someone who knows absolutely nothing about trading and systematically guide them from market mechanics, price action structure, and Smart Money Concepts to quantitative statistics, algorithmic thinking, and a complete professional trading business plan.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-kkn-gold font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              20 Structured Levels
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <BookOpen className="w-4 h-4 text-sky-400" />
              60 In-Depth Lessons
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              Interactive Concept Quizzes
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Resume Learning Bar */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 flex-1 w-full">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-kkn-gold" />
              Overall Academy Progress
            </span>
            <span className="text-kkn-gold font-bold">
              {completedSlugs.length} of {totalLessons} Lessons Completed ({overallProgress}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {lastOpened && (
          <Link
            to={`/academy/level/${lastOpened.levelId}/lesson/${lastOpened.lessonSlug}`}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-kkn-gold/40 text-kkn-gold text-xs font-mono font-bold flex items-center gap-2 shrink-0 transition-all"
          >
            <span>Resume Last Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search levels, lessons, topics (e.g. SMC, Pips, RSI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-kkn-gold font-mono"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterDifficulty === diff
                  ? 'bg-kkn-gold text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Showing Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredLevels.length}</strong> of 20 Academy Levels
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-kkn-gold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* 20 Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLevels.map((level) => {
          const progress = getLevelProgress(level);
          return <CourseCard key={level.id} course={level} progress={progress} />;
        })}
      </div>
    </div>
  );
};
