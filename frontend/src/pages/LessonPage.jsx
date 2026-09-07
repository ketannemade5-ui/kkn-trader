import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { QuizModal } from '../components/academy/QuizModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

export const LessonPage = () => {
  const { courseSlug, lessonSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await courseAPI.getLesson(courseSlug, lessonSlug);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseSlug, lessonSlug]);

  const handleMarkCompleted = async () => {
    if (isAuthenticated) {
      try {
        await courseAPI.markCompleted(courseSlug, lessonSlug);
        setCompleted(true);
        success('Lesson marked as completed! Progress updated.');
      } catch (err) {
        setCompleted(true);
      }
    } else {
      setCompleted(true);
      info('Completed in guest session. Log in to save to your trader profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-kkn-gold/30 border-t-kkn-gold rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Loading Structured Curriculum...</span>
        </div>
      </div>
    );
  }

  if (!data?.lesson) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Lesson Not Found</h2>
        <p className="text-xs text-slate-400">This module may still be in development or under review.</p>
        <Link to="/learn" className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-kkn-gold">
          Return to Academy
        </Link>
      </div>
    );
  }

  const { lesson, quiz, prevLesson, nextLesson } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-4">
        <Link to="/learn" className="hover:text-kkn-gold flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Courses</span>
        </Link>

        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-kkn-gold font-bold">
          LEVEL {lesson.level} • {lesson.courseSlug.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] leading-tight">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            {lesson.readTimeMinutes || 8} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-kkn-gold" />
            Institutional Concept
          </span>
        </div>
      </div>

      {/* 1. OVERVIEW */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-kkn-gold border-slate-800 space-y-2">
        <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4" />
          Executive Overview
        </span>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {lesson.overview}
        </p>
      </div>

      {/* 2. SIMPLE BEGINNER EXPLANATION */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
          Simple Beginner Explanation
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
          {lesson.simpleExplanation}
        </p>
      </div>

      {/* 3. DETAILED INSTITUTIONAL EXPLANATION */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
          Detailed Institutional Analysis
        </h2>
        <div className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <p>{lesson.detailedExplanation}</p>
        </div>
      </div>

      {/* 4. REAL MARKET EXAMPLE */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">3</span>
          Real Market Example
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {lesson.realMarketExample}
          </p>
        </div>
      </div>

      {/* 5. KEY POINTS */}
      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Outfit']">Key Points to Memorize</h2>
          <div className="grid grid-cols-1 gap-2.5">
            {lesson.keyPoints.map((pt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. COMMON MISTAKES */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-3">
          <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Common Pitfalls & Mistakes to Avoid
          </span>
          <ul className="space-y-2 text-xs text-rose-200/90">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 7. RELATED CONCEPTS */}
      {lesson.relatedConcepts && lesson.relatedConcepts.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-slate-400">Related Trading Concepts:</span>
          <div className="flex flex-wrap gap-2">
            {lesson.relatedConcepts.map((concept) => (
              <Link
                key={concept}
                to={`/ai?q=${encodeURIComponent(concept)}`}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-kkn-gold transition-colors"
              >
                #{concept}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Quiz Button */}
      {quiz && (
        <div className="glass-panel rounded-2xl p-6 border border-kkn-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-gold-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-kkn-gold/20 border border-kkn-gold/40 flex items-center justify-center text-kkn-gold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">Module Assessment Quiz</h3>
              <p className="text-xs text-slate-400 font-mono">Test your comprehension with 3 quick questions</p>
            </div>
          </div>

          <button
            onClick={() => setQuizOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gold-gradient shadow-gold-glow hover:brightness-110 transition-all shrink-0 w-full sm:w-auto"
          >
            Take Module Quiz
          </button>
        </div>
      )}

      {/* Complete Lesson Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <button
          onClick={handleMarkCompleted}
          disabled={completed}
          className={`px-6 py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
            completed
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              : 'bg-slate-900 border border-slate-700 hover:border-kkn-gold text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {completed ? 'Lesson Completed ✓' : 'Mark as Completed'}
        </button>

        <div className="flex items-center gap-3">
          {prevLesson && (
            <Link
              to={`/learn/${courseSlug}/${prevLesson.slug}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </Link>
          )}

          {nextLesson && (
            <Link
              to={`/learn/${courseSlug}/${nextLesson.slug}`}
              className="px-4 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 font-mono shadow-gold-sm hover:brightness-110"
            >
              Next Lesson
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Quiz Modal Render */}
      {quizOpen && quiz && (
        <QuizModal
          quiz={quiz}
          courseSlug={courseSlug}
          onClose={() => setQuizOpen(false)}
          onQuizComplete={() => setCompleted(true)}
        />
      )}
    </div>
  );
};
