import React, { useState } from 'react';
import { quizAPI } from '../../services/api';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  ArrowRight,
  X,
} from 'lucide-react';

export const QuizModal = ({ quiz, courseSlug, onClose, onQuizComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (questionIndex, optionId) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await quizAPI.submitQuiz(courseSlug, selectedAnswers);
      if (res.success && res.data) {
        setResult(res.data);
        setSubmitted(true);
        if (onQuizComplete) {
          onQuizComplete(res.data);
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const allAnswered = quiz.questions.every((_, idx) => selectedAnswers[idx]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-kkn-gold/20 border border-kkn-gold/40 flex items-center justify-center text-kkn-gold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">{quiz.title}</h2>
            <p className="text-xs text-slate-400 font-mono">Test your comprehension before proceeding</p>
          </div>
        </div>

        {/* Results Banner if Submitted */}
        {submitted && result && (
          <div
            className={`mb-8 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              result.passed
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black font-mono ${
                  result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {result.scorePercent}%
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-['Outfit']">
                  {result.passed ? 'Assessment Passed!' : 'Requires Review'}
                </h4>
                <p className="text-xs text-slate-300">
                  {result.correctCount} of {result.totalQuestions} questions answered correctly (Passing: {result.passingScorePercent}%)
                </p>
              </div>
            </div>

            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Assessment
            </button>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIdx) => {
            const reviewItem = result?.review?.[qIdx];

            return (
              <div
                key={q._id || qIdx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-mono font-bold text-kkn-gold">
                    Question {qIdx + 1}
                  </span>
                  {submitted && reviewItem && (
                    <span
                      className={`text-xs font-bold flex items-center gap-1 font-mono ${
                        reviewItem.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {reviewItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Incorrect
                        </>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = selectedAnswers[qIdx] === opt.id;
                    let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (submitted && reviewItem) {
                      if (opt.id === reviewItem.correctOptionId) {
                        optionStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200';
                      } else if (isSelected && !reviewItem.isCorrect) {
                        optionStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-200';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-kkn-gold/15 border-kkn-gold text-kkn-gold font-bold shadow-gold-sm';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] uppercase">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submission */}
                {submitted && reviewItem && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                    <strong className="text-kkn-gold block mb-1">Institutional Explanation:</strong>
                    {reviewItem.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              className={`px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                allAnswered && !loading
                  ? 'bg-gold-gradient text-slate-950 shadow-gold-glow hover:brightness-110'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Evaluating Answers...' : 'Submit Assessment'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
