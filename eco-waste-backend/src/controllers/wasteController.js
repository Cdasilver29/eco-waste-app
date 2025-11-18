const WasteLog = require('../models/WasteLog');
const User = require('../models/User');
const gamificationService = require('../services/gamificationService');

// @desc    Log waste disposal
// @route   POST /api/waste/log
// @access  Private
exports.logWaste = async (req, res) => {
  try {
    const { type, category, weight, item, image, classification, location } = req.body;

    // Get user's municipality
    const user = await User.findById(req.user._id);
    
    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned to your account'
      });
    }

    // Calculate points based on action
    let action = 'WASTE_LOG';
    if (classification?.method === 'ai_scan') {
      action = 'AI_SCAN';
    }

    // Create waste log
    const wasteLog = await WasteLog.create({
      user: req.user._id,
      municipality: user.municipality,
      type,
      category,
      weight: weight || 0,
      item,
      image,
      classification,
      location
    });

    // Award points and update streak
    const pointsResult = await gamificationService.awardPoints(
      req.user._id, 
      action, 
      { weight: wasteLog.weight }
    );

    // Update user's streak
    await gamificationService.updateStreak(req.user._id);

    // Save points to waste log
    wasteLog.points = pointsResult.points;
    await wasteLog.save();

    res.status(201).json({
      success: true,
      message: 'Waste logged successfully',
      data: {
        log: wasteLog,
        points: pointsResult.points,
        totalPoints: pointsResult.totalPoints,
        level: pointsResult.level
      }
    });
  } catch (error) {
    console.error('Log waste error:', error);
    res.status(500).json({
      error: 'Failed to log waste',
      message: error.message
    });
  }
};

// @desc    Get user's waste history
// @route   GET /api/waste/history
// @access  Private
exports.getWasteHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const logs = await WasteLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('municipality', 'name');

    const total = await WasteLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch waste history',
      message: error.message
    });
  }
};

// @desc    Get waste statistics
// @route   GET /api/waste/stats
// @access  Private
exports.getWasteStats = async (req, res) => {
  try {
    // Total waste logged
    const totalLogs = await WasteLog.countDocuments({ user: req.user._id });

    // Total weight
    const weightResult = await WasteLog.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$weight' } } }
    ]);
    const totalWeight = weightResult[0]?.total || 0;

    // Breakdown by type
    const breakdown = await WasteLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          weight: { $sum: '$weight' }
        }
      }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await WasteLog.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          weight: { $sum: '$weight' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get user's gamification stats
    const user = await User.findById(req.user._id)
      .select('gamification')
      .populate('gamification.badges.badgeId');

    res.json({
      success: true,
      data: {
        summary: {
          totalLogs,
          totalWeight: totalWeight.toFixed(2),
          breakdown
        },
        recentActivity,
        gamification: user.gamification
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/waste/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { municipalityId, period = 'all_time', limit = 50 } = req.query;

    if (!municipalityId) {
      return res.status(400).json({
        error: 'Municipality ID is required'
      });
    }

    const leaderboard = await gamificationService.getLeaderboard(
      municipalityId,
      period,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch leaderboard',
      message: error.message
    });
  }
};

// @desc    Get user's rank
// @route   GET /api/waste/my-rank
// @access  Private
exports.getMyRank = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned'
      });
    }

    // Count users with more points
    const rank = await User.countDocuments({
      municipality: user.municipality,
      'gamification.points': { $gt: user.gamification.points },
      active: true
    }) + 1;

    // Total users
    const totalUsers = await User.countDocuments({
      municipality: user.municipality,
      active: true
    });

    res.json({
      success: true,
      data: {
        rank,
        totalUsers,
        points: user.gamification.points,
        level: user.gamification.level,
        percentile: ((totalUsers - rank + 1) / totalUsers * 100).toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch rank',
      message: error.message
    });
  }
};
