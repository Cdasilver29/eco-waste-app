const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Route = require('../models/Route');
const geolib = require('geolib');

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || !user.active) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user._id}`);

    // Join user's personal room
    socket.join(`user:${socket.user._id}`);

    // Track route
    socket.on('track_route', async (routeId) => {
      try {
        const route = await Route.findOne({ routeId }).populate('hauler', 'profile');

        if (!route) {
          socket.emit('error', { message: 'Route not found' });
          return;
        }

        // Join route room
        socket.join(`route:${routeId}`);
        
        // Send initial route data
        socket.emit('route_data', {
          routeId: route.routeId,
          status: route.status,
          hauler: route.hauler?.profile,
          waypoints: route.waypoints,
          currentLocation: route.currentLocation,
          vehicle: route.vehicle
        });

        console.log(`User ${socket.user._id} tracking route ${routeId}`);
      } catch (error) {
        console.error('Track route error:', error);
        socket.emit('error', { message: 'Failed to track route' });
      }
    });

    // Update location (for haulers)
    socket.on('update_location', async (data) => {
      try {
        const { routeId, location } = data;

        // Verify user is the hauler for this route
        const route = await Route.findOne({ 
          routeId, 
          hauler: socket.user._id 
        });

        if (!route) {
          socket.emit('error', { message: 'Unauthorized or route not found' });
          return;
        }

        // Update route location
        route.currentLocation = {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        };
        route.lastLocationUpdate = new Date();
        await route.save();

        // Calculate ETA to next waypoint
        const nextWaypoint = route.waypoints.find(wp => wp.status === 'pending');
        let eta = null;

        if (nextWaypoint) {
          const distance = geolib.getDistance(
            { latitude: location.lat, longitude: location.lng },
            {
              latitude: nextWaypoint.location.coordinates[1],
              longitude: nextWaypoint.location.coordinates[0]
            }
          );

          // Estimate time (assuming 30 km/h average speed)
          const timeMinutes = Math.round((distance / 1000) / 30 * 60);
          eta = timeMinutes;
        }

        // Broadcast to all tracking this route
        io.to(`route:${routeId}`).emit('location_update', {
          routeId,
          location: {
            lng: location.lng,
            lat: location.lat
          },
          timestamp: new Date(),
          eta,
          nextWaypoint: nextWaypoint?.address
        });

        console.log(`Location updated for route ${routeId}`);
      } catch (error) {
        console.error('Update location error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Complete waypoint
    socket.on('complete_waypoint', async (data) => {
      try {
        const { routeId, waypointIndex } = data;

        const route = await Route.findOne({ 
          routeId, 
          hauler: socket.user._id 
        });

        if (!route) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        // Update waypoint status
        if (route.waypoints[waypointIndex]) {
          route.waypoints[waypointIndex].status = 'completed';
          route.waypoints[waypointIndex].actualTime = new Date();
          await route.save();

          // Broadcast update
          io.to(`route:${routeId}`).emit('waypoint_completed', {
            routeId,
            waypointIndex,
            address: route.waypoints[waypointIndex].address
          });

          console.log(`Waypoint ${waypointIndex} completed for route ${routeId}`);
        }
      } catch (error) {
        console.error('Complete waypoint error:', error);
        socket.emit('error', { message: 'Failed to complete waypoint' });
      }
    });

    // Stop tracking
    socket.on('stop_tracking', (routeId) => {
      socket.leave(`route:${routeId}`);
      console.log(`User ${socket.user._id} stopped tracking route ${routeId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user._id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

module.exports = { initializeSocket, getIO };