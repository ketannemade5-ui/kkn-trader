const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['ACADEMY', 'QUIZ', 'TRADING', 'JOURNAL', 'DISCIPLINE'],
    required: true,
  },
  icon: {
    type: String,
    default: 'Award',
  },
  points: {
    type: Number,
    default: 100,
  },
});

const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  achievementKey: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
});

userAchievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });

module.exports = {
  Achievement: mongoose.model('Achievement', achievementSchema),
  UserAchievement: mongoose.model('UserAchievement', userAchievementSchema),
};
