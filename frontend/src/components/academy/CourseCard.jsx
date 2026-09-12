import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
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
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  BookOpen,
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

export const CourseCard = ({ course, progress = 0 }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[course.badgeIcon] || Compass;

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Institutional Master': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const isCompleted = progress === 100;
  const levelUrl = `/academy/level/${course.level}`;

  return (
    <div
      onClick={() => navigate(levelUrl)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(levelUrl);
        }
      }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-kkn-gold/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-kkn-gold/40 relative overflow-hidden"
    >
      <div>
        {/* Top Header: Level Badge & Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-kkn-gold/15 text-kkn-gold border border-kkn-gold/30">
              LEVEL {course.level}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                difficultyColors[course.difficulty] || difficultyColors.Beginner
              }`}
            >
              {course.difficulty}
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-kkn-gold group-hover:scale-110 group-hover:border-kkn-gold/40 transition-all">
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2 font-['Outfit'] group-hover:text-kkn-gold transition-colors">
          {course.title}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {course.tagline || course.description}
        </p>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Level Progress</span>
            <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-kkn-gold'}`}>
              {isCompleted ? 'Completed ✓' : `${progress}%`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500' : 'bg-gold-gradient'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta Stats & Link */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            {course.lessons ? `${course.lessons.length} Lessons` : '3 Lessons'}
          </span>

          <Link
            to={levelUrl}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-kkn-gold font-bold hover:translate-x-1 transition-transform group-hover:text-yellow-300"
          >
            <span>{isCompleted ? 'Review Level' : 'Explore Level'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
