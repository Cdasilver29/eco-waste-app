const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function simulateHauler() {
  try {
    console.log('🚛 Starting Hauler Simulator...\n');

    // 1. Login as hauler
    console.log('1. Logging in as hauler...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'hauler@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    console.log('✅ Logged in\n');

    // 2. Get active routes
    console.log('2. Getting my routes...');
    const routesRes = await axios.get(`${BASE_URL}/api/routes/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (routesRes.data.count === 0) {
      console.log('⚠️  No active routes. Run seed script first.');
      return;
    }

    const route = routesRes.data.data[0];
    const routeId = route.routeId;
    console.log(`✅ Active route: ${routeId}\n`);

    // 3. Connect to WebSocket
    console.log('3. Connecting to WebSocket...');
    const socket = io(BASE_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('✅ Connected. Starting location simulation...\n');

      // Simulate movement along route
      let currentWaypoint = 0;
      const waypoints = route.waypoints;

      const interval = setInterval(() => {
        if (currentWaypoint >= waypoints.length) {
          console.log('🏁 Route completed!');
          clearInterval(interval);
          
          // Complete the route
          axios.put(
            `${BASE_URL}/api/routes/${routeId}/complete`,
            { wasteCollected: 500, actualDistance: 15, fuelUsed: 8 },
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(() => {
            console.log('✅ Route marked as completed');
            socket.disconnect();
            process.exit(0);
          });
          
          return;
        }

        const wp = waypoints[currentWaypoint];
        const location = {
          lng: wp.location.coordinates[0],
          lat: wp.location.coordinates[1]
        };

        console.log(`📍 Moving to: ${wp.address}`);
        console.log(`   Location: ${JSON.stringify(location)}`);

        // Update location
        socket.emit('update_location', {
          routeId,
          location
        });

        // After 5 seconds, complete this waypoint
        setTimeout(() => {
          console.log(`✅ Completed: ${wp.address}\n`);
          socket.emit('complete_waypoint', {
            routeId,
            waypointIndex: currentWaypoint
          });
          currentWaypoint++;
        }, 5000);

      }, 10000); // Every 10 seconds

    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

  } catch (error) {
    console.error('❌ Simulation failed:', error.response?.data || error.message);
  }
}

simulateHauler();
