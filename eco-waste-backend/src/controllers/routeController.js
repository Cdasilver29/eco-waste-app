const Route = require('../models/Route');
const User = require('../models/User');
const mapService = require('../services/mapService');
const { v4: uuidv4 } = require('uuid');

// @desc    Get active routes in area
// @route   GET /api/routes/active
// @access  Private
exports.getActiveRoutes = async (req, res) => {
  try {
    const { lng, lat, radius = 10000 } = req.query;
    const user = await User.findById(req.user._id);

    const query = {
      municipality: user.municipality,
      status: { $in: ['in_progress', 'planned'] },
      scheduledDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
      }
    };

    // If location provided, filter by proximity
    if (lng && lat) {
      query.currentLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const routes = await Route.find(query)
      .populate('hauler', 'profile.firstName profile.lastName profile.phone')
      .select('-subscribers');

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch routes',
      message: error.message
    });
  }
};

// @desc    Get route details
// @route   GET /api/routes/:routeId
// @access  Private
exports.getRouteDetails = async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.routeId })
      .populate('hauler', 'profile')
      .populate('municipality', 'name');

    if (!route) {
      return res.status(404).json({
        error: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch route',
      message: error.message
    });
  }
};

// @desc    Subscribe to route notifications
// @route   POST /api/routes/:routeId/subscribe
// @access  Private
exports.subscribeToRoute = async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.routeId });

    if (!route) {
      return res.status(404).json({
        error: 'Route not found'
      });
    }

    if (route.subscribers.includes(req.user._id)) {
      return res.status(400).json({
        error: 'Already subscribed to this route'
      });
    }

    route.subscribers.push(req.user._id);
    await route.save();

    res.json({
      success: true,
      message: 'Subscribed to route notifications'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to subscribe',
      message: error.message
    });
  }
};

// @desc    Create route (Hauler/Admin)
// @route   POST /api/routes
// @access  Private/Hauler/Admin
exports.createRoute = async (req, res) => {
  try {
    const {
      name,
      wasteType,
      zone,
      waypoints,
      scheduledDate,
      vehicle
    } = req.body;

    const user = await User.findById(req.user._id);

    // Generate unique route ID
    const routeId = `RT-${Date.now()}-${uuidv4().slice(0, 8)}`;

    // Optimize waypoints
    let optimizedWaypoints = waypoints;
    if (waypoints.length > 2) {
      try {
        const optimization = await mapService.optimizeRoute(
          waypoints.map(wp => ({ lng: wp.lng, lat: wp.lat }))
        );
        
        // Reorder waypoints based on optimization
        optimizedWaypoints = optimization.waypoints.map((wp, idx) => ({
          ...waypoints[wp.waypointIndex],
          estimatedTime: new Date(Date.now() + idx * 15 * 60 * 1000) // 15 min apart
        }));
      } catch (error) {
        console.log('Route optimization failed, using original order');
      }
    }

    const route = await Route.create({
      municipality: user.municipality,
      routeId,
      name,
      hauler: req.user._id,
      vehicle,
      wasteType,
      zone,
      waypoints: optimizedWaypoints.map(wp => ({
        address: wp.address,
        location: {
          type: 'Point',
          coordinates: [wp.lng, wp.lat]
        },
        estimatedTime: wp.estimatedTime,
        status: 'pending'
      })),
      scheduledDate,
      status: 'planned'
    });

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      error: 'Failed to create route',
      message: error.message
    });
  }
};

// @desc    Start route (Hauler)
// @route   PUT /api/routes/:routeId/start
// @access  Private/Hauler
exports.startRoute = async (req, res) => {
  try {
    const route = await Route.findOne({
      routeId: req.params.routeId,
      hauler: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Route not found or unauthorized'
      });
    }

    route.status = 'in_progress';
    route.startTime = new Date();
    await route.save();

    res.json({
      success: true,
      message: 'Route started',
      data: route
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to start route',
      message: error.message
    });
  }
};

// @desc    Complete route (Hauler)
// @route   PUT /api/routes/:routeId/complete
// @access  Private/Hauler
exports.completeRoute = async (req, res) => {
  try {
    const { wasteCollected, actualDistance, fuelUsed } = req.body;

    const route = await Route.findOne({
      routeId: req.params.routeId,
      hauler: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Route not found or unauthorized'
      });
    }

    route.status = 'completed';
    route.endTime = new Date();
    route.efficiency = {
      ...route.efficiency,
      actualDistance: actualDistance || route.efficiency.actualDistance,
      wasteCollected: wasteCollected || 0,
      fuelUsed: fuelUsed || 0,
      timeOnRoute: Math.round((route.endTime - route.startTime) / 60000) // minutes
    };

    await route.save();

    res.json({
      success: true,
      message: 'Route completed',
      data: route
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to complete route',
      message: error.message
    });
  }
};
