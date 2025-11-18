const imageRecognitionService = require('../services/imageRecognitionService');
const WasteLog = require('../models/WasteLog');
const User = require('../models/User');
const gamificationService = require('../services/gamificationService');

// @desc    Classify waste from image
// @route   POST /api/image/classify
// @access  Private
exports.classifyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    // Validate image size
    imageRecognitionService.validateImageSize(req.file.buffer);

    // Get image metadata
    const metadata = await imageRecognitionService.getImageMetadata(req.file.buffer);
    console.log('Image metadata:', metadata);

    // Get user's municipality
    const user = await User.findById(req.user._id);
    
    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned to your account'
      });
    }

    // Classify image using Vision API
    const classification = await imageRecognitionService.classifyWithVisionAPI(
      req.file.buffer
    );

    // Enhance with local disposal information
    const enhancedResult = await imageRecognitionService.enhanceClassification(
      classification,
      user.municipality
    );

    res.json({
      success: true,
      data: enhancedResult
    });
  } catch (error) {
    console.error('Image classification error:', error);
    res.status(500).json({
      error: 'Failed to classify image',
      message: error.message
    });
  }
};

// @desc    Classify and log waste
// @route   POST /api/image/scan-and-log
// @access  Private
exports.scanAndLog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    const { weight, location, notes } = req.body;

    // Validate image
    imageRecognitionService.validateImageSize(req.file.buffer);

    // Get user's municipality
    const user = await User.findById(req.user._id);
    
    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned'
      });
    }

    // Classify image
    const classification = await imageRecognitionService.classifyWithVisionAPI(
      req.file.buffer
    );

    // Enhance with disposal info
    const enhancedResult = await imageRecognitionService.enhanceClassification(
      classification,
      user.municipality
    );

    // Convert image to base64 for storage (in production, upload to S3/Cloudinary)
    const base64Image = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;

    // Create waste log
    const wasteLog = await WasteLog.create({
      user: req.user._id,
      municipality: user.municipality,
      type: classification.wasteType,
      category: classification.category,
      weight: parseFloat(weight) || 0,
      item: classification.description,
      image: base64Image, // In production, use S3 URL
      classification: {
        method: 'ai_scan',
        confidence: classification.confidence,
        suggestions: [classification.instructions]
      },
      location: location ? {
        type: 'Point',
        coordinates: [
          parseFloat(location.lng || location.longitude || 0),
          parseFloat(location.lat || location.latitude || 0)
        ]
      } : undefined,
      notes
    });

    // Award points
    const pointsResult = await gamificationService.awardPoints(
      req.user._id,
      'AI_SCAN',
      { weight: wasteLog.weight }
    );

    // Update streak
    await gamificationService.updateStreak(req.user._id);

    // Save points to log
    wasteLog.points = pointsResult.points;
    await wasteLog.save();

    res.status(201).json({
      success: true,
      message: 'Waste scanned and logged successfully! 📸',
      data: {
        classification: enhancedResult,
        log: wasteLog,
        points: pointsResult.points,
        totalPoints: pointsResult.totalPoints,
        level: pointsResult.level
      }
    });
  } catch (error) {
    console.error('Scan and log error:', error);
    res.status(500).json({
      error: 'Failed to scan and log waste',
      message: error.message
    });
  }
};

// @desc    Get classification history
// @route   GET /api/image/history
// @access  Private
exports.getClassificationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await WasteLog.find({
      user: req.user._id,
      'classification.method': 'ai_scan'
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-image'); // Don't send base64 images in list

    const total = await WasteLog.countDocuments({
      user: req.user._id,
      'classification.method': 'ai_scan'
    });

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
      error: 'Failed to fetch history',
      message: error.message
    });
  }
};

// @desc    Get scan statistics
// @route   GET /api/image/stats
// @access  Private
exports.getScanStats = async (req, res) => {
  try {
    // Total scans
    const totalScans = await WasteLog.countDocuments({
      user: req.user._id,
      'classification.method': 'ai_scan'
    });

    // Average confidence
    const avgConfidence = await WasteLog.aggregate([
      {
        $match: {
          user: req.user._id,
          'classification.method': 'ai_scan'
        }
      },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$classification.confidence' }
        }
      }
    ]);

    // Breakdown by category
    const categoryBreakdown = await WasteLog.aggregate([
      {
        $match: {
          user: req.user._id,
          'classification.method': 'ai_scan'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalScans,
        averageConfidence: avgConfidence[0]?.avgConfidence || 0,
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
};
