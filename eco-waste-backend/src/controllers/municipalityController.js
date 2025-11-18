const Municipality = require('../models/Municipality');

// @desc    Get all municipalities
// @route   GET /api/municipalities
// @access  Public
exports.getAllMunicipalities = async (req, res) => {
  try {
    const municipalities = await Municipality.find({ active: true })
      .select('name slug country region config.contactInfo');

    res.json({
      success: true,
      count: municipalities.length,
      data: municipalities
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch municipalities',
      message: error.message
    });
  }
};

// @desc    Get municipality by slug
// @route   GET /api/municipalities/:slug
// @access  Public
exports.getMunicipalityBySlug = async (req, res) => {
  try {
    const municipality = await Municipality.findOne({ 
      slug: req.params.slug,
      active: true 
    });

    if (!municipality) {
      return res.status(404).json({
        error: 'Municipality not found'
      });
    }

    res.json({
      success: true,
      data: municipality
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch municipality',
      message: error.message
    });
  }
};

// @desc    Get waste types for municipality
// @route   GET /api/municipalities/:slug/waste-types
// @access  Public
exports.getWasteTypes = async (req, res) => {
  try {
    const municipality = await Municipality.findOne({ 
      slug: req.params.slug 
    }).select('config.wasteTypes');

    if (!municipality) {
      return res.status(404).json({
        error: 'Municipality not found'
      });
    }

    res.json({
      success: true,
      data: municipality.config.wasteTypes
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch waste types',
      message: error.message
    });
  }
};

// @desc    Get facilities near location
// @route   GET /api/municipalities/:slug/facilities
// @access  Public
exports.getNearbyFacilities = async (req, res) => {
  try {
    const { lng, lat, radius = 5000, type } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        error: 'Longitude and latitude are required'
      });
    }

    const query = {
      slug: req.params.slug,
      active: true,
      'facilities.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) // meters
        }
      }
    };

    // Filter by facility type if provided
    if (type) {
      query['facilities.type'] = type;
    }

    const municipality = await Municipality.findOne(query);

    if (!municipality) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Filter facilities by type if specified
    let facilities = municipality.facilities;
    if (type) {
      facilities = facilities.filter(f => f.type === type);
    }

    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch facilities',
      message: error.message
    });
  }
};

// @desc    Create municipality (Admin only)
// @route   POST /api/municipalities
// @access  Private/Admin
exports.createMunicipality = async (req, res) => {
  try {
    const municipality = await Municipality.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Municipality created successfully',
      data: municipality
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create municipality',
      message: error.message
    });
  }
};

// @desc    Update municipality
// @route   PUT /api/municipalities/:id
// @access  Private/Admin
exports.updateMunicipality = async (req, res) => {
  try {
    const municipality = await Municipality.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!municipality) {
      return res.status(404).json({
        error: 'Municipality not found'
      });
    }

    res.json({
      success: true,
      message: 'Municipality updated successfully',
      data: municipality
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update municipality',
      message: error.message
    });
  }
};
