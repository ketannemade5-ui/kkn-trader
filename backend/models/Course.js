const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  level: {
    type: Number,
    required: true, // 1 to 12
    min: 1,
    max: 12,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Trading Basics',
      'Market Basics',
      'Candlesticks & Charts',
      'Technical Analysis',
      'Price Action',
      'SMC / ICT Concepts',
      'Fundamental Analysis',
      'Risk Management',
      'Trading Psychology',
      'Strategy Building',
      'Trade Management',
      'Advanced Analysis'
    ],
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  estimatedHours: {
    type: Number,
    default: 4,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Institutional Master'],
    default: 'Beginner',
  },
  badgeIcon: {
    type: String,
    default: 'GraduationCap',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  lessonCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
