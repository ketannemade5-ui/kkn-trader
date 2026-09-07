const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  completedLessons: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    lessonSlug: String,
    courseSlug: String,
    completedAt: { type: Date, default: Date.now },
  }],
  quizResults: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    totalQuestions: Number,
    passed: Boolean,
    attemptedAt: { type: Date, default: Date.now },
  }],
  courseProgress: [{
    courseSlug: String,
    percentComplete: { type: Number, default: 0 },
    lastLessonSlug: String,
    updatedAt: { type: Date, default: Date.now },
  }],
  currentOverallLevel: {
    type: Number,
    default: 1,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
