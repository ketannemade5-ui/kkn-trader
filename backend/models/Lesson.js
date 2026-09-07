const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseSlug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  order: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  simpleExplanation: {
    type: String,
    required: true,
  },
  detailedExplanation: {
    type: String,
    required: true,
  },
  visualExampleType: {
    type: String,
    default: 'chart',
  },
  visualExampleData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  visualExampleCaption: {
    type: String,
    default: '',
  },
  realMarketExample: {
    type: String,
    required: true,
  },
  keyPoints: {
    type: [String],
    default: [],
  },
  commonMistakes: {
    type: [String],
    default: [],
  },
  relatedConcepts: {
    type: [String],
    default: [],
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null,
  },
  readTimeMinutes: {
    type: Number,
    default: 8,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

lessonSchema.index({ courseSlug: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);
