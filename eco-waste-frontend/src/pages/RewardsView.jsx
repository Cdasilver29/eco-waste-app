import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Trophy, Star, Zap, Target, Gift, Clock, 
  CheckCircle, Lock, TrendingUp, Users, Calendar,
  Filter, Search, Download, Share2, Eye, X
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { wasteAPI, municipalityAPI } from '../services/api';
import { toast } from 'react-toastify';

const RewardsView = () => {
  const [activeTab, setActiveTab] = useState('badges');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const userStats = {
    level: 12,
    points: 2450,
    nextLevel: 3000,
    progress: 82,
    rank: 23,
    badgesEarned: 8,
    totalBadges: 15,
    streak: 15
  };

  const badges = [
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Logged 100kg of total waste',
      icon: '🌱',
      category: 'waste-logging',
      earned: true,
      dateEarned: '2024-01-10',
      progress: 100,
      requirement: '100 kg total waste',
      rarity: 'common',
      points: 100
    },
    {
      id: 'recycling-pro',
      name: 'Recycling Pro',
      description: 'Perfect recycling streak for 30 days',
      icon: '♻️',
      category: 'streak',
      earned: true,
      dateEarned: '2024-01-05',
      progress: 100,
      requirement: '30-day perfect streak',
      rarity: 'rare',
      points: 250
    },
    {
      id: 'plastic-crusher',
      name: 'Plastic Crusher',
      description: 'Recycled 50kg of plastic materials',
      icon: '🥤',
      category: 'material-specific',
      earned: false,
      progress: 75,
      requirement: '50 kg plastic waste',
      rarity: 'uncommon',
      points: 150,
      currentProgress: '37.5/50 kg'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete waste logging before 8 AM for 7 consecutive days',
      icon: '🌅',
      category: 'time-based',
      earned: false,
      progress: 42,
      requirement: '7 days before 8 AM',
      rarity: 'rare',
      points: 200,
      currentProgress: '3/7 days'
    },
    {
      id: 'community-hero',
      name: 'Community Hero',
      description: 'Referred 5 friends to join EcoWaste',
      icon: '👥',
      category: 'social',
      earned: true,
      dateEarned: '2024-01-12',
      progress: 100,
      requirement: '5 successful referrals',
      rarity: 'uncommon',
      points: 300
    },
    {
      id: 'zero-waste',
      name: 'Zero Waste Champion',
      description: 'Maintain zero general waste for 14 days',
      icon: '🚯',
      category: 'sustainability',
      earned: false,
      progress: 28,
      requirement: '14 days zero general waste',
      rarity: 'epic',
      points: 500,
      currentProgress: '4/14 days'
    },
    {
      id: 'variety-seeker',
      name: 'Variety Seeker',
      description: 'Log all 6 different waste types',
      icon: '🎯',
      category: 'variety',
      earned: false,
      progress: 66,
      requirement: '6 different waste types',
      rarity: 'uncommon',
      points: 180,
      currentProgress: '4/6 types'
    },
    {
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      description: 'Complete waste logging every weekend for a month',
      icon: '🏆',
      category: 'consistency',
      earned: false,
      progress: 50,
      requirement: '4 consecutive weekends',
      rarity: 'rare',
      points: 220,
      currentProgress: '2/4 weekends'
    }
  ];

  const achievements = [
    {
      id: 'first-log',
      title: 'First Waste Log',
      description: 'Logged your first waste item',
      points: 25,
      earned: true,
      date: '2024-01-01',
      icon: '🎉'
    },
    {
      id: 'streak-7',
      title: '7-Day Streak',
      description: 'Maintained a 7-day logging streak',
      points: 50,
      earned: true,
      date: '2024-01-08',
      icon: '🔥'
    },
    {
      id: 'plastic-10kg',
      title: 'Plastic Pioneer',
      description: 'Recycled 10kg of plastic',
      points: 75,
      earned: true,
      date: '2024-01-05',
      icon: '🥤'
    },
    {
      id: 'referral-1',
      title: 'Eco Ambassador',
      description: 'Referred your first friend',
      points: 100,
      earned: true,
      date: '2024-01-10',
      icon: '👥'
    },
    {
      id: 'level-5',
      title: 'Rising Star',
      description: 'Reached level 5',
      points: 150,
      earned: true,
      date: '2024-01-07',
      icon: '⭐'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Eco Champion', points: 5420, level: 25, avatar: '🌍' },
    { rank: 2, name: 'Green Warrior', points: 4870, level: 22, avatar: '🌿' },
    { rank: 3, name: 'Recycle Master', points: 4320, level: 20, avatar: '♻️' },
    { rank: 23, name: 'You', points: userStats.points, level: userStats.level, avatar: '👤', isCurrentUser: true },
    { rank: 4, name: 'Planet Saver', points: 3980, level: 18, avatar: '🌎' },
    { rank: 5, name: 'Eco Hero', points: 3650, level: 17, avatar: '💚' }
  ];

  const categories = [
    { id: 'all', label: 'All Badges', count: badges.length },
    { id: 'waste-logging', label: 'Waste Logging', count: badges.filter(b => b.category === 'waste-logging').length },
    { id: 'streak', label: 'Streaks', count: badges.filter(b => b.category === 'streak').length },
    { id: 'material-specific', label: 'Material Specific', count: badges.filter(b => b.category === 'material-specific').length },
    { id: 'social', label: 'Social', count: badges.filter(b => b.category === 'social').length }
  ];

  const filteredBadges = filterCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === filterCategory);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-green-500 to-emerald-600';
      case 'uncommon': return 'from-blue-500 to-indigo-600';
      case 'rare': return 'from-purple-500 to-pink-600';
      case 'epic': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-green-600';
      case 'uncommon': return 'text-blue-600';
      case 'rare': return 'text-purple-600';
      case 'epic': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Badges & Rewards</h1>
          <p className="text-slate-600">Track your achievements and earn recognition for your eco-friendly efforts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Progress</span>
          </button>
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-emerald-100 text-sm">Level {userStats.level}</span>
          </div>
          <p className="text-2xl font-bold">{userStats.points} pts</p>
          <p className="text-emerald-100 text-sm">Next: {userStats.nextLevel} pts</p>
          <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${userStats.progress}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <Award className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{userStats.badgesEarned}/{userStats.totalBadges}</p>
          <p className="text-slate-600 text-sm">Badges Earned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <Zap className="w-6 h-6 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{userStats.streak} days</p>
          <p className="text-slate-600 text-sm">Current Streak</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">#{userStats.rank}</p>
          <p className="text-slate-600 text-sm">Global Rank</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex space-x-4 border-b border-slate-200 pb-4 mb-6">
          {['badges', 'achievements', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Category Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    filterCategory === category.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-6 rounded-2xl shadow-lg border-2 cursor-pointer transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{badge.icon}</div>
                    <h3 className="font-bold text-slate-800 text-center mb-2">{badge.name}</h3>
                    <p className="text-sm text-slate-600 text-center mb-3">{badge.description}</p>
                    
                    {badge.earned ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-1 text-sm text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Earned</span>
                        </div>
                        <p className="text-xs text-slate-500">+{badge.points} points</p>
                        <p className="text-xs text-slate-400">{badge.dateEarned}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-1 text-sm text-slate-500">
                          <Lock className="w-4 h-4" />
                          <span>Locked</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                              style={{ width: `${badge.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{badge.currentProgress}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{achievement.title}</h4>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">+{achievement.points}</span>
                  </div>
                  <p className="text-xs text-slate-500">points earned</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  player.isCurrentUser
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                      : player.isCurrentUser
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {player.rank}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div>
                    <h4 className={`font-semibold ${
                      player.isCurrentUser ? 'text-emerald-700' : 'text-slate-800'
                    }`}>
                      {player.name}
                    </h4>
                    <p className="text-sm text-slate-600">Level {player.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{player.points.toLocaleString()} pts</p>
                  <p className="text-sm text-slate-500">Total Points</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Badge Details</h3>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">{selectedBadge.icon}</div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{selectedBadge.name}</h4>
              <p className="text-slate-600 mb-4">{selectedBadge.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Rarity:</span>
                  <span className={`font-semibold ${getRarityText(selectedBadge.rarity)}`}>
                    {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Points:</span>
                  <span className="font-semibold text-emerald-600">+{selectedBadge.points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Requirement:</span>
                  <span className="font-medium text-slate-800">{selectedBadge.requirement}</span>
                </div>

                {selectedBadge.earned ? (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-center space-x-2 text-emerald-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Badge Earned!</span>
                    </div>
                    <p className="text-sm text-emerald-600 mt-1">Completed on {selectedBadge.dateEarned}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Progress</span>
                      <span>{selectedBadge.progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                        style={{ width: `${selectedBadge.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{selectedBadge.currentProgress}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RewardsView;