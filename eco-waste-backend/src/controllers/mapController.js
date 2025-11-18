const mapService = require('../services/mapService');
const User = require('../models/User');

// @desc    Get nearby facilities
// @route   GET /api/maps/facilities/nearby
// @access  Private
exports.getNearbyFacilities = async (req, res) => {
  try {
    const { lng, lat, radius = 5000, type } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        error: 'Longitude and latitude are required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned'
      });
    }

    const facilities = await mapService.getNearbyFacilities(
      parseFloat(lng),
      parseFloat(lat),
      parseInt(radius),
      type,
      user.municipality
    );

    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch nearby facilities',
      message: error.message
    });
  }
};

// @desc    Get directions
// @route   POST /api/maps/directions
// @access  Private
exports.getDirections = async (req, res) => {
  try {
    const { start, end, profile = 'driving' } = req.body;

    if (!start || !end) {
      return res.status(400).json({
        error: 'Start and end coordinates are required'
      });
    }

    const directions = await mapService.getDirections(start, end, profile);

    res.json({
      success: true,
      data: directions
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get directions',
      message: error.message
    });
  }
};

// @desc    Geocode address
// @route   GET /api/maps/geocode
// @access  Public
exports.geocodeAddress = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        error: 'Address is required'
      });
    }

    const result = await mapService.geocodeAddress(address);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to geocode address',
      message: error.message
    });
  }
};

// @desc    Reverse geocode
// @route   GET /api/maps/reverse-geocode
// @access  Public
exports.reverseGeocode = async (req, res) => {
  try {
    const { lng, lat } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        error: 'Longitude and latitude are required'
      });
    }

    const address = await mapService.reverseGeocode(
      parseFloat(lng),
      parseFloat(lat)
    );

    res.json({
      success: true,
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to reverse geocode',
      message: error.message
    });
  }
};
