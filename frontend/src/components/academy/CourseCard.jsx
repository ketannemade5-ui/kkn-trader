import React from 'react';
import { Link } from 'react-router-dom';
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
};

export const CourseCard = ({ course, progress = 0 }) => {
  const IconComponent = iconMap[course.badgeIcon] || Compass;

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Institutional Master': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-kkn-gold/40 transition-all duration-300">
      <div>
        {/* Header: Level Badge & Difficulty */}
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
          {course.description}
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-kkn-gold font-bold">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Meta Stats & Link */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            ~{course.estimatedHours || 5} Hours
          </span>

          <Link
            to={`/learn/${course.slug}`}
            className="flex items-center gap-1 text-kkn-gold font-bold hover:translate-x-1 transition-transform group-hover:text-yellow-300"
          >
            <span>Explore Level</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
