const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Route = require('../models/Route');
const geolib = require('geolib');
const { generateAIResponse } = require('../controllers/chatSocketController');

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || !user.active) {
        return next(new Error('User not found or inactive'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // ===================================================================
  // CONNECTION
  // ===================================================================
  io.on('connection', (socket) => {
    console.log(`✅ Connected -> ${socket.user._id}`);

    // Personal room for notifications
    socket.join(`user:${socket.user._id}`);

    // ===================================================================
    // REAL TIME CHAT
    // ===================================================================

    socket.on('user_message', async (data) => {
      try {
        const { sessionId, message } = data;

        // Emit user's message instantly to UI
        io.to(socket.id).emit('new_message', {
          role: 'user',
          content: message,
          timestamp: new Date()
        });

        // Generate assistant reply
        const aiReply = await generateAIResponse(sessionId, message);

        io.to(socket.id).emit('new_message', {
          role: 'assistant',
          content: aiReply,
          timestamp: new Date()
        });

      } catch (err) {
        console.error("AI chat error:", err);
        io.to(socket.id).emit('new_message', {
          role: 'assistant',
          content: "I ran into an issue. Try again."
        });
      }
    });

    // ===================================================================
    // ROUTE TRACKING
    // ===================================================================

    socket.on('track_route', async (routeId) => {
      try {
        const route = await Route.findOne({ routeId }).populate('hauler', 'profile');

        if (!route) {
          socket.emit('error', { message: 'Route not found' });
          return;
        }

        socket.join(`route:${routeId}`);

        socket.emit('route_data', {
          routeId: route.routeId,
          status: route.status,
          hauler: route.hauler?.profile,
          waypoints: route.waypoints,
          currentLocation: route.currentLocation,
          vehicle: route.vehicle
        });

        console.log(`📌 User ${socket.user._id} tracking route ${routeId}`);
      } catch (error) {
        console.error('Track route error:', error);
        socket.emit('error', { message: 'Failed to track route' });
      }
    });

    socket.on('update_location', async (data) => {
      try {
        const { routeId, location } = data;

        const route = await Route.findOne({
          routeId,
          hauler: socket.user._id
        });

        if (!route) {
          socket.emit('error', { message: 'Unauthorized or route not found' });
          return;
        }

        route.currentLocation = {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        };
        route.lastLocationUpdate = new Date();
        await route.save();

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
          eta = Math.round((distance / 1000) / 30 * 60);
        }

        io.to(`route:${routeId}`).emit('location_update', {
          routeId,
          location,
          timestamp: new Date(),
          eta,
          nextWaypoint: nextWaypoint?.address
        });

        console.log(`📡 Location updated for ${routeId}`);
      } catch (error) {
        console.error('Update location error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

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

        if (route.waypoints[waypointIndex]) {
          route.waypoints[waypointIndex].status = 'completed';
          route.waypoints[waypointIndex].actualTime = new Date();
          await route.save();

          io.to(`route:${routeId}`).emit('waypoint_completed', {
            routeId,
            waypointIndex,
            address: route.waypoints[waypointIndex].address
          });

          console.log(`✔ Waypoint ${waypointIndex} completed for ${routeId}`);
        }
      } catch (error) {
        console.error('Waypoint error:', error);
        socket.emit('error', { message: 'Failed to complete waypoint' });
      }
    });

    socket.on('stop_tracking', (routeId) => {
      socket.leave(`route:${routeId}`);
      console.log(`🛑 User stopped tracking ${routeId}`);
    });

    // ===================================================================
    // DISCONNECT
    // ===================================================================
    socket.on('disconnect', () => {
      console.log(`❌ Disconnected -> ${socket.user._id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

module.exports = { initializeSocket, getIO };
