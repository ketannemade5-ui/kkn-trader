import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ACADEMY_LEVELS } from '../data/academyData';
import { getCompletedLessons, getLevelProgress, getQuizScores } from '../utils/academyProgress';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Trophy,
  Compass,
  Globe,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  ShieldCheck,
  Brain,
  Cpu,
  Sliders,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  Compass,
  Globe,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  ShieldCheck,
  Brain,
  Cpu,
  Sliders,
  Award,
  Zap,
  Sparkles,
  Clock,
};

export const CourseDetailPage = () => {
  const { levelId, courseSlug } = useParams();
  const navigate = useNavigate();

  // Find level by numeric levelId OR by slug
  const level = ACADEMY_LEVELS.find((l) => {
    if (levelId) {
      return String(l.level) === String(levelId) || String(l.id) === String(levelId);
    }
    if (courseSlug) {
      return l.slug === courseSlug || String(l.level) === String(courseSlug);
    }
    return false;
  }) || ACADEMY_LEVELS[0];

  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    const completed = getCompletedLessons();
    setCompletedSlugs(completed);
    setProgressPercent(getLevelProgress(level));
    const scores = getQuizScores();
    setQuizScore(scores[level.level] || null);
  }, [level]);

  if (!level) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Level Not Found</h2>
        <p className="text-xs text-slate-400">The requested Academy level could not be found.</p>
        <Link
          to="/academy"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-kkn-gold text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 20 Levels</span>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[level.badgeIcon] || Compass;

  // Find next uncompleted lesson or default to first lesson
  const firstUncompletedLesson =
    level.lessons.find((l) => !completedSlugs.includes(l.slug)) || level.lessons[0];

  const prevLevel = ACADEMY_LEVELS.find((l) => l.level === level.level - 1);
  const nextLevel = ACADEMY_LEVELS.find((l) => l.level === level.level + 1);

  const completedCount = level.lessons.filter((l) => completedSlugs.includes(l.slug)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-slate-800 pb-4">
        <Link to="/academy" className="hover:text-kkn-gold flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 20 Levels</span>
        </Link>

        <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-kkn-gold font-bold">
          LEVEL {level.level} OF 20 • {level.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-kkn-gold/30 shadow-gold-glow relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kkn-gold/15 border border-kkn-gold/30 text-kkn-gold text-xs font-mono font-bold">
              <IconComponent className="w-4 h-4" />
              <span>LEVEL {level.level} CURRICULUM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit']">
              {level.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {level.tagline}
            </p>
          </div>

          {/* Quick Action CTA */}
          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
            <Link
              to={`/academy/level/${level.level}/lesson/${firstUncompletedLesson.slug}`}
              className="px-6 py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-black text-xs font-mono shadow-gold-glow hover:brightness-110 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>{completedCount === 0 ? 'START LEVEL' : 'CONTINUE LEARNING'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-xs font-mono text-slate-400">
              {completedCount} of {level.lessons.length} Lessons Completed ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Meta Stats Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-kkn-gold" />
            ~{level.estimatedHours} Hours
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            {level.lessons.length} Comprehensive Lessons
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            5-Question Level Quiz
          </span>
          {quizScore && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5" />
              Quiz Score: {quizScore.percent}% ({quizScore.passed ? 'PASSED ✓' : 'RETRY'})
            </span>
          )}
        </div>
      </div>

      {/* Course Overview & Learning Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-kkn-gold" />
            <span>Course Overview</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {level.description}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Learning Goals</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {level.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-kkn-gold font-bold">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lesson List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-kkn-gold" />
            <span>Level {level.level} Lessons ({level.lessons.length})</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Click any lesson to start</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {level.lessons.map((lesson, idx) => {
            const isCompleted = completedSlugs.includes(lesson.slug);
            return (
              <div
                key={lesson.slug}
                onClick={() => navigate(`/academy/level/${level.level}/lesson/${lesson.slug}`)}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Order Number Box */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-kkn-gold border-slate-700 group-hover:border-kkn-gold'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : `0${lesson.order}`}
                  </div>

                  {/* Lesson Meta */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        LESSON {lesson.order} OF {level.lessons.length}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          COMPLETED ✓
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-kkn-gold transition-colors">
                      {lesson.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {lesson.readTime || 10} min read
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">Step-by-step breakdown & 5-Q Quiz</span>
                    </div>
                  </div>
                </div>

                {/* Open Button */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-kkn-gold group-hover:underline flex items-center gap-1">
                    <span>{isCompleted ? 'Review Lesson' : 'Open Lesson'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Navigation Footer */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLevel ? (
          <Link
            to={`/academy/level/${prevLevel.level}`}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Previous: Level {prevLevel.level} ({prevLevel.title})</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          to="/academy"
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-kkn-gold border border-slate-800 text-xs font-mono font-bold text-center w-full sm:w-auto"
        >
          All 20 Levels
        </Link>

        {nextLevel ? (
          <Link
            to={`/academy/level/${nextLevel.level}`}
            className="px-5 py-3 rounded-xl bg-gold-gradient text-slate-950 text-xs font-mono font-black shadow-gold-sm hover:brightness-110 flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
          >
            <span>Next: Level {nextLevel.level} ({nextLevel.title}) →</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
