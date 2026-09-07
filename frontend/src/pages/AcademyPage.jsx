import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import { CourseCard } from '../components/academy/CourseCard';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

export const AcademyPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getCourses();
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load academy courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Institutional Master'];

  const filteredCourses = courses.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-kkn-gold/30 shadow-gold-glow relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
            <GraduationCap className="w-4 h-4" />
            12-LEVEL STRUCTURED CURRICULUM
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
            KKN Trading Academy
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Designed to take someone who knows absolutely nothing about trading and systematically guide them through market mechanics, price action structure, Smart Money Concepts, mathematical risk management, and psychology.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-kkn-gold font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              12 Comprehensive Levels
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <BookOpen className="w-4 h-4 text-sky-400" />
              Interactive Concept Quizzes
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              Progress Milestone Badges
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDifficulty === diff
                  ? 'bg-kkn-gold text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing <strong className="text-white">{filteredCourses.length}</strong> Course Modules
        </span>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
