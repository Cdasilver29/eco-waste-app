const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testWebSocket() {
  try {
    console.log('🧪 Testing WebSocket Real-time Tracking...\n');

    // 1. Login to get token
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    console.log('✅ Logged in\n');

    // 2. Get active routes
    console.log('2. Getting active routes...');
    const routesRes = await axios.get(`${BASE_URL}/api/routes/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (routesRes.data.count === 0) {
      console.log('⚠️  No active routes found. Run seed script first.');
      return;
    }

    const routeId = routesRes.data.data[0].routeId;
    console.log(`✅ Found route: ${routeId}\n`);

    // 3. Connect to WebSocket
    console.log('3. Connecting to WebSocket...');
    const socket = io(BASE_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected\n');

      // 4. Track route
      console.log(`4. Tracking route ${routeId}...`);
      socket.emit('track_route', routeId);
    });

    socket.on('route_data', (data) => {
      console.log('✅ Received route data:');
      console.log(`   Status: ${data.status}`);
      console.log(`   Waypoints: ${data.waypoints.length}`);
      console.log(`   Current location: ${JSON.stringify(data.currentLocation)}\n`);
    });

    socket.on('location_update', (data) => {
      console.log('📍 Location update:');
      console.log(`   Location: ${JSON.stringify(data.location)}`);
      console.log(`   ETA: ${data.eta} minutes`);
      console.log(`   Next stop: ${data.nextWaypoint}\n`);
    });

    socket.on('waypoint_completed', (data) => {
      console.log('✅ Waypoint completed:');
      console.log(`   Address: ${data.address}\n`);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    // Keep connection alive for 30 seconds
    console.log('Listening for updates for 30 seconds...\n');
    setTimeout(() => {
      console.log('🎉 Test complete!');
      socket.disconnect();
      process.exit(0);
    }, 30000);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testWebSocket();
