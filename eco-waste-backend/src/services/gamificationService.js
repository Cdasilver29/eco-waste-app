const User = require('../models/User');
const Badge = require('../models/Badge');
const WasteLog = require('../models/WasteLog');

class GamificationService {
  // Points system
  POINTS = {
    WASTE_LOG: 10,
    CORRECT_SORTING: 20,
    AI_SCAN: 15,
    DROP_OFF: 25,
    DAILY_STREAK: 50,
    WEIGHT_BONUS: 5 // per kg
  };

  async awardPoints(userId, action, metadata = {}) {
    try {
      let points = this.POINTS[action] || 0;
      
      // Add weight bonus if applicable
      if (metadata.weight) {
        points += Math.floor(metadata.weight * this.POINTS.WEIGHT_BONUS);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $inc: { 'gamification.points': points }
        },
        { new: true }
      );

      // Check for level up
      const newLevel = Math.floor(user.gamification.points / 1000) + 1;
      if (newLevel > user.gamification.level) {
        user.gamification.level = newLevel;
        await user.save();
        
        console.log(`🎉 User ${userId} leveled up to level ${newLevel}!`);
      }

      // Check for badge achievements
      await this.checkBadges(userId);

      return { 
        points, 
        totalPoints: user.gamification.points, 
        level: user.gamification.level 
      };
    } catch (error) {
      console.error('Award points error:', error);
      throw error;
    }
  }

  async checkBadges(userId) {
    try {
      const user = await User.findById(userId).populate('gamification.badges.badgeId');
      const earnedBadgeIds = user.gamification.badges.map(b => b.badgeId?._id?.toString()).filter(Boolean);
      
      const availableBadges = await Badge.find({ 
        active: true,
        _id: { $nin: earnedBadgeIds }
      });

      for (const badge of availableBadges) {
        const earned = await this.evaluateBadgeCriteria(userId, badge);
        
        if (earned) {
          user.gamification.badges.push({
            badgeId: badge._id,
            earnedAt: new Date()
          });
          
          user.gamification.points += badge.points;
          
          await user.save();
          
          console.log(`🏆 User ${userId} earned badge: ${badge.name}`);
        }
      }
    } catch (error) {
      console.error('Check badges error:', error);
    }
  }

  async evaluateBadgeCriteria(userId, badge) {
    const { action, threshold, timeframe } = badge.criteria;
    
    let query = { user: userId };
    
    // Apply timeframe filter
    if (timeframe !== 'all_time') {
      const now = new Date();
      let startDate;
      
      if (timeframe === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeframe === 'weekly') {
        startDate = new Date(now.setDate(now.getDate() - 7));
      }
      
      query.createdAt = { $gte: startDate };
    }

    switch (action) {
      case 'recycle_count':
        const count = await WasteLog.countDocuments(query);
        return count >= threshold;
      
      case 'weight_recycled':
        const result = await WasteLog.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: '$weight' } } }
        ]);
        return result[0]?.total >= threshold;
      
      case 'streak_days':
        const user = await User.findById(userId);
        return user.gamification.streak.current >= threshold;
      
      case 'scan_count':
        const scanQuery = { ...query, 'classification.method': 'ai_scan' };
        const scanCount = await WasteLog.countDocuments(scanQuery);
        return scanCount >= threshold;
      
      default:
        return false;
    }
  }

  async updateStreak(userId) {
    try {
      const user = await User.findById(userId);
      const today = new Date().setHours(0, 0, 0, 0);
      const lastActivity = user.gamification.streak.lastActivity 
        ? new Date(user.gamification.streak.lastActivity).setHours(0, 0, 0, 0)
        : null;

      if (!lastActivity) {
        // First activity
        user.gamification.streak.current = 1;
        user.gamification.streak.longest = 1;
      } else {
        const daysDiff = (today - lastActivity) / (1000 * 60 * 60 * 24);

        if (daysDiff === 1) {
          // Continue streak
          user.gamification.streak.current += 1;
          if (user.gamification.streak.current > user.gamification.streak.longest) {
            user.gamification.streak.longest = user.gamification.streak.current;
          }
        } else if (daysDiff > 1) {
          // Streak broken
          user.gamification.streak.current = 1;
        }
        // If daysDiff === 0, same day - don't change streak
      }

      user.gamification.streak.lastActivity = new Date();
      await user.save();

      // Award streak bonus every 7 days
      if (user.gamification.streak.current % 7 === 0) {
        await this.awardPoints(userId, 'DAILY_STREAK');
      }

      return user.gamification.streak;
    } catch (error) {
      console.error('Update streak error:', error);
      throw error;
    }
  }

  async getLeaderboard(municipalityId, period = 'all_time', limit = 50) {
    try {
      const match = { municipality: municipalityId, active: true };
      
      if (period === 'monthly') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        // Aggregate points from waste logs this month
        const monthlyPoints = await WasteLog.aggregate([
          { 
            $match: { 
              municipality: municipalityId,
              createdAt: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: '$user',
              points: { $sum: '$points' }
            }
          },
          { $sort: { points: -1 } },
          { $limit: limit }
        ]);
        
        const userIds = monthlyPoints.map(p => p._id);
        const users = await User.find({ _id: { $in: userIds } })
          .select('profile.firstName profile.lastName profile.avatar gamification');
        
        return monthlyPoints.map((p, index) => {
          const user = users.find(u => u._id.toString() === p._id.toString());
          return {
            rank: index + 1,
            userId: p._id,
            name: user ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
            avatar: user?.profile.avatar,
            points: p.points,
            level: user?.gamification.level || 1,
            badges: user?.gamification.badges.length || 0
          };
        });
      } else {
        // All-time leaderboard
        const users = await User.find(match)
          .select('profile.firstName profile.lastName profile.avatar gamification')
          .sort({ 'gamification.points': -1 })
          .limit(limit);
        
        return users.map((user, index) => ({
          rank: index + 1,
          userId: user._id,
          name: `${user.profile.firstName} ${user.profile.lastName}`,
          avatar: user.profile.avatar,
          points: user.gamification.points,
          level: user.gamification.level,
          badges: user.gamification.badges.length
        }));
      }
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }
}

module.exports = new GamificationService();
