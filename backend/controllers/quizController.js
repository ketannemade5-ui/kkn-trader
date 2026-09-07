const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');
const { SEED_QUIZZES } = require('../services/seedService');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc   Get Quiz by courseSlug
// @route  GET /api/quizzes/:courseSlug
// @access Public
const getQuiz = async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    let quiz = null;

    if (isDbConnected()) {
      try {
        quiz = await Quiz.findOne({ courseSlug });
      } catch (e) {
        // fallback
      }
    }

    if (!quiz) {
      quiz = SEED_QUIZZES.find(q => q.courseSlug === courseSlug) || SEED_QUIZZES[0];
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'No quiz found for this module.' });
    }

    const sanitizedQuestions = quiz.questions.map((q, idx) => ({
      _id: q._id || `q_${idx}`,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      data: {
        title: quiz.title,
        courseSlug: quiz.courseSlug,
        questionsCount: sanitizedQuestions.length,
        questions: sanitizedQuestions,
        passingScorePercent: quiz.passingScorePercent || 75,
      },
    });
  } catch (err) {
    const fallback = SEED_QUIZZES[0];
    res.status(200).json({
      success: true,
      data: {
        title: fallback.title,
        courseSlug: fallback.courseSlug,
        questionsCount: fallback.questions.length,
        questions: fallback.questions.map((q, idx) => ({
          _id: `q_${idx}`,
          question: q.question,
          options: q.options,
        })),
        passingScorePercent: 75,
      },
    });
  }
};

// @desc   Submit answers for a quiz
// @route  POST /api/quizzes/:courseSlug/submit
// @access Public / Private
const submitQuiz = async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    const { answers } = req.body;

    let quiz = null;
    if (isDbConnected()) {
      try {
        quiz = await Quiz.findOne({ courseSlug });
      } catch (e) {
        // fallback
      }
    }

    if (!quiz) {
      quiz = SEED_QUIZZES.find(q => q.courseSlug === courseSlug) || SEED_QUIZZES[0];
    }

    let correctCount = 0;
    const review = quiz.questions.map((q, idx) => {
      const selected = answers ? answers[idx] : null;
      const isCorrect = selected === q.correctOptionId;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        options: q.options,
        userSelected: selected,
        correctOptionId: q.correctOptionId,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const total = quiz.questions.length;
    const scorePercent = Math.round((correctCount / total) * 100);
    const passed = scorePercent >= (quiz.passingScorePercent || 75);

    res.status(200).json({
      success: true,
      data: {
        scorePercent,
        correctCount,
        totalQuestions: total,
        passed,
        passingScorePercent: quiz.passingScorePercent || 75,
        review,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuiz,
  submitQuiz,
};
