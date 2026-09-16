import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ACADEMY_LEVELS } from '../data/academyData';
import { getLessonBySlug } from '../data/lessonsData';
import {
  markLessonCompletedLocal,
  isLessonCompleted,
  saveLastOpenedLesson,
  saveQuizScore,
} from '../utils/academyProgress';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseAPI } from '../services/api';
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
  Award,
  ShieldCheck,
  TrendingUp,
  Activity,
  Target,
  ListOrdered,
  FileCheck,
  RotateCcw,
} from 'lucide-react';

export const LessonPage = () => {
  const { levelId, courseSlug, lessonId, lessonSlug } = useParams();
  const activeLessonSlug = lessonSlug || lessonId;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Interactive 5-Question Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // --- Quiz progress persistence helpers ---
  const getQuizStorageKey = (slug) => `kkn_quiz_progress_${slug}`;

  const saveQuizProgress = (slug, answers, submitted, score) => {
    try {
      sessionStorage.setItem(
        getQuizStorageKey(slug),
        JSON.stringify({ answers, submitted, score })
      );
    } catch (e) { /* ignore quota errors */ }
  };

  const loadQuizProgress = (slug) => {
    try {
      const raw = sessionStorage.getItem(getQuizStorageKey(slug));
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          answers: parsed.answers || {},
          submitted: !!parsed.submitted,
          score: parsed.score || 0,
        };
      }
    } catch (e) { /* ignore parse errors */ }
    return null;
  };

  const clearQuizProgress = (slug) => {
    try {
      sessionStorage.removeItem(getQuizStorageKey(slug));
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    setLoading(true);
    // Fetch lesson data from comprehensive database
    const lessonData = getLessonBySlug(activeLessonSlug);
    if (lessonData) {
      setLesson(lessonData);
      setCompleted(isLessonCompleted(activeLessonSlug));
      saveLastOpenedLesson(lessonData.levelId, activeLessonSlug);
    }

    // Restore saved quiz progress for this lesson, or reset if none exists
    const savedQuiz = loadQuizProgress(activeLessonSlug);
    if (savedQuiz) {
      setSelectedAnswers(savedQuiz.answers);
      setQuizSubmitted(savedQuiz.submitted);
      setQuizScore(savedQuiz.score);
    } else {
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
    }

    setLoading(false);
  }, [activeLessonSlug, levelId, courseSlug]);

  const handleMarkCompleted = async () => {
    markLessonCompletedLocal(activeLessonSlug);
    setCompleted(true);
    success('Lesson marked as completed! Level progress updated.');

    if (isAuthenticated && courseSlug) {
      try {
        await courseAPI.markCompleted(courseSlug, activeLessonSlug);
      } catch (e) {
        // local already updated
      }
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [qIdx]: optIdx };
      saveQuizProgress(activeLessonSlug, updated, false, 0);
      return updated;
    });
  };

  const handleSubmitQuiz = () => {
    if (!lesson || !lesson.quiz) return;
    let score = 0;
    lesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    saveQuizProgress(activeLessonSlug, selectedAnswers, true, score);
    saveQuizScore(lesson.levelId, score, lesson.quiz.length);

    if (score >= 3) {
      markLessonCompletedLocal(activeLessonSlug);
      setCompleted(true);
      success(`Congratulations! You passed with ${score}/${lesson.quiz.length} correct!`);
    } else {
      info(`You scored ${score}/${lesson.quiz.length}. Review the lesson and try again.`);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    clearQuizProgress(activeLessonSlug);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-kkn-gold/30 border-t-kkn-gold rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Loading Structured Lesson...</span>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-['Outfit']">Lesson Not Found</h2>
        <p className="text-xs text-slate-400">The requested curriculum lesson could not be loaded.</p>
        <Link
          to="/academy"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-kkn-gold font-mono"
        >
          Return to 20 Academy Levels
        </Link>
      </div>
    );
  }

  // Find current level and previous/next lessons
  const currentLevel = ACADEMY_LEVELS.find((l) => l.id === lesson.levelId) || ACADEMY_LEVELS[0];
  const allFlatLessons = ACADEMY_LEVELS.flatMap((lvl) =>
    lvl.lessons.map((lsn) => ({ ...lsn, levelId: lvl.level, levelTitle: lvl.title }))
  );
  const currentFlatIdx = allFlatLessons.findIndex((l) => l.slug === activeLessonSlug);
  const prevLesson = currentFlatIdx > 0 ? allFlatLessons[currentFlatIdx - 1] : null;
  const nextLesson = currentFlatIdx < allFlatLessons.length - 1 ? allFlatLessons[currentFlatIdx + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-slate-800 pb-4">
        <Link
          to={`/academy/level/${lesson.levelId}`}
          className="hover:text-kkn-gold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Level {lesson.levelId} Course</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/academy" className="text-slate-500 hover:text-slate-300">
            Academy
          </Link>
          <span className="text-slate-600">/</span>
          <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-kkn-gold font-bold">
            LEVEL {lesson.levelId} • {lesson.levelTitle}
          </span>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] leading-tight">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-4 h-4 text-kkn-gold" />
            {lesson.readTime || 10} min read
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Institutional Quality
          </span>
          {completed && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* 1. INTRODUCTION & EXECUTIVE OVERVIEW */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-kkn-gold border-slate-800 space-y-2">
        <span className="text-xs font-mono font-bold text-kkn-gold uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4" />
          Executive Overview
        </span>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {lesson.introduction}
        </p>
      </div>

      {/* 2. BEGINNER-FRIENDLY EXPLANATION */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
          Beginner-Friendly Explanation
        </h2>
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm sm:text-base text-slate-300 leading-relaxed">
          {lesson.beginnerExplanation}
        </div>
      </div>

      {/* 3. DETAILED INSTITUTIONAL EXPLANATION */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
          Detailed Institutional Analysis
        </h2>
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm sm:text-base text-slate-300 leading-relaxed space-y-3">
          <p>{lesson.detailedExplanation}</p>
        </div>
      </div>

      {/* 4. IMPORTANT TERMINOLOGY */}
      {lesson.terminology && lesson.terminology.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-kkn-gold" />
            <span>Key Terminology to Master</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.terminology.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-kkn-gold">{item.term}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STEP-BY-STEP CONCEPT BREAKDOWN */}
      {lesson.stepByStepBreakdown && lesson.stepByStepBreakdown.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-sky-400" />
            <span>Step-by-Step Concept Breakdown</span>
          </h2>
          <div className="space-y-2">
            {lesson.stepByStepBreakdown.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. STRATEGY FRAMEWORK (MARKET CONTEXT -> BIAS -> SETUP -> ENTRY -> SL -> TP -> REVIEW) */}
      {lesson.strategyFramework && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span>Complete Strategy Execution Framework</span>
          </h2>
          <div className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-kkn-gold font-bold">1. MARKET CONTEXT:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.marketContext}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-kkn-gold font-bold">2. BIAS:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.bias}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-kkn-gold font-bold">3. SETUP:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.setup}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-kkn-gold font-bold">4. CONFIRMATION:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.confirmation}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">5. ENTRY CONDITIONS:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.entry}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-bold">6. STOP LOSS LOGIC:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.stopLoss}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">7. TAKE PROFIT LOGIC:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.takeProfit}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-sky-400 font-bold">8. TRADE MANAGEMENT & REVIEW:</span>
                <p className="text-slate-300 mt-1">{lesson.strategyFramework.tradeManagement}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. BULLISH & BEARISH REAL FOREX EXAMPLES */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Realistic Forex Market Scenarios</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <TrendingUp className="w-4 h-4" />
              Bullish Setup Example
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {lesson.bullishExample}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 uppercase">
              <Activity className="w-4 h-4" />
              Bearish Setup Example
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {lesson.bearishExample}
            </p>
          </div>
        </div>
      </div>

      {/* 8. COMMON MISTAKES & HOW TO AVOID THEM */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-3">
          <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Common Pitfalls & Mistakes to Avoid
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-rose-200/90">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. PRACTICAL & BACKTESTING EXERCISES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono font-bold text-kkn-gold flex items-center gap-1.5 uppercase">
            <Target className="w-4 h-4" />
            Practical Paper Trading Exercise
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.practicalExercise}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5 uppercase">
            <FileCheck className="w-4 h-4" />
            Historical Backtesting Exercise
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.backtestingExercise}
          </p>
        </div>
      </div>

      {/* 10. KEY TAKEAWAYS */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Outfit']">Key Takeaways to Remember</h2>
          <div className="grid grid-cols-1 gap-2.5">
            {lesson.keyTakeaways.map((pt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-500 leading-relaxed">
        <strong>EDUCATIONAL DISCLAIMER:</strong> All charts, setups, and examples presented in the KKN Trading Academy are strictly for educational and simulation training purposes. Past performance is no guarantee of future returns. Financial trading carries inherent risk of capital loss.
      </div>

      {/* 11. INTERACTIVE 5-QUESTION MODULE QUIZ */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-kkn-gold/40 shadow-gold-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-kkn-gold/20 border border-kkn-gold/40 flex items-center justify-center text-kkn-gold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Lesson Comprehension Quiz ({lesson.quiz.length} Questions)
                </h3>
                <p className="text-xs font-mono text-slate-400">Score 60%+ to complete this lesson</p>
              </div>
            </div>

            {quizSubmitted && (
              <div className="text-right">
                <span className={`text-base font-black font-mono ${quizScore >= 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Score: {quizScore}/{lesson.quiz.length} ({Math.round((quizScore / lesson.quiz.length) * 100)}%)
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              return (
                <div key={qIdx} className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-kkn-gold">
                    Question {qIdx + 1} of {lesson.quiz.length}
                  </span>
                  <p className="text-sm font-semibold text-white">{q.question}</p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isChosen && optIdx !== q.correctIndex) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-kkn-gold/20 border-kkn-gold text-kkn-gold font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-slate-300 border border-slate-800">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                className="px-6 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gold-gradient shadow-gold-glow hover:brightness-110 disabled:opacity-40 transition-all font-mono"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={handleRetakeQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-kkn-gold font-mono flex items-center gap-1.5 border border-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complete Lesson & Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <button
          onClick={handleMarkCompleted}
          disabled={completed}
          className={`px-6 py-3.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 w-full sm:w-auto justify-center ${
            completed
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'bg-slate-900 border border-slate-700 hover:border-kkn-gold text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {completed ? 'Lesson Completed ✓' : 'Mark Lesson as Completed'}
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {prevLesson && (
            <Link
              to={`/academy/level/${prevLesson.levelId}/lesson/${prevLesson.slug}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous Lesson
            </Link>
          )}

          {nextLesson && (
            <Link
              to={`/academy/level/${nextLesson.levelId}/lesson/${nextLesson.slug}`}
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 font-mono shadow-gold-sm hover:brightness-110"
            >
              Next Lesson
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
