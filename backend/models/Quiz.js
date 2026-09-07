const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
  }],
  correctOptionId: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: false,
  },
  courseSlug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  passingScorePercent: {
    type: Number,
    default: 75,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
