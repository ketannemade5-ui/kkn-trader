const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: [
      'Forex',
      'Technical Analysis',
      'Price Action',
      'SMC',
      'Fundamental Analysis',
      'Risk Management',
      'Trading Psychology',
      'Beginner Guides',
    ],
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'KKN Trader Institutional Team',
  },
  readTimeMinutes: {
    type: Number,
    default: 5,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
