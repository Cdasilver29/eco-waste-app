const Badge = require('../models/Badge');

const badges = [
  {
    name: 'First Steps',
    description: 'Log your first waste item',
    icon: '🌱',
    type: 'milestone',
    criteria: {
      action: 'recycle_count',
      threshold: 1,
      timeframe: 'all_time'
    },
    points: 50,
    rarity: 'common'
  },
  {
    name: 'Eco Warrior',
    description: 'Log 10 waste items',
    icon: '♻️',
    type: 'milestone',
    criteria: {
      action: 'recycle_count',
      threshold: 10,
      timeframe: 'all_time'
    },
    points: 100,
    rarity: 'common'
  },
  {
    name: 'Recycling Champion',
    description: 'Log 50 waste items',
    icon: '🏆',
    type: 'milestone',
    criteria: {
      action: 'recycle_count',
      threshold: 50,
      timeframe: 'all_time'
    },
    points: 250,
    rarity: 'rare'
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    type: 'streak',
    criteria: {
      action: 'streak_days',
      threshold: 7,
      timeframe: 'all_time'
    },
    points: 200,
    rarity: 'rare'
  },
  {
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
    type: 'streak',
    criteria: {
      action: 'streak_days',
      threshold: 30,
      timeframe: 'all_time'
    },
    points: 500,
    rarity: 'epic'
  },
  {
    name: 'Heavy Lifter',
    description: 'Recycle 100kg of waste',
    icon: '💪',
    type: 'achievement',
    criteria: {
      action: 'weight_recycled',
      threshold: 100,
      timeframe: 'all_time'
    },
    points: 300,
    rarity: 'rare'
  },
  {
    name: 'AI Explorer',
    description: 'Use AI scanner 10 times',
    icon: '📸',
    type: 'achievement',
    criteria: {
      action: 'scan_count',
      threshold: 10,
      timeframe: 'all_time'
    },
    points: 150,
    rarity: 'common'
  },
  {
    name: 'Sustainability Legend',
    description: 'Recycle 500kg of waste',
    icon: '👑',
    type: 'special',
    criteria: {
      action: 'weight_recycled',
      threshold: 500,
      timeframe: 'all_time'
    },
    points: 1000,
    rarity: 'legendary'
  }
];

async function seedBadges() {
  try {
    // Check if badges already exist
    const existingCount = await Badge.countDocuments();
    
    if (existingCount > 0) {
      console.log('✅ Badges already exist');
      return;
    }

    await Badge.insertMany(badges);
    console.log(`✅ Created ${badges.length} badges`);
  } catch (error) {
    console.error('❌ Badge seed error:', error);
    throw error;
  }
}

module.exports = seedBadges;
