const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['milestone', 'streak', 'special', 'achievement'],
    default: 'achievement'
  },
  criteria: {
    action: {
      type: String,
      required: true,
      enum: ['recycle_count', 'weight_recycled', 'streak_days', 'scan_count', 'referrals']
    },
    threshold: {
      type: Number,
      required: true
    },
    timeframe: {
      type: String,
      enum: ['all_time', 'monthly', 'weekly'],
      default: 'all_time'
    }
  },
  points: {
    type: Number,
    default: 50
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
