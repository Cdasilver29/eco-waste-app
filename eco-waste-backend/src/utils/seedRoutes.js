// src/utils/seedRoutes.js
const Route = require('../models/Route');
const User = require('../models/User');
const Municipality = require('../models/Municipality');

async function seedRoutes() {
  try {
    // Find municipality first
    const municipality = await Municipality.findOne({ name: 'Nairobi' });
    if (!municipality) {
      console.log('⚠️  No municipality found. Run seedData() first.');
      return;
    }

    // Ensure test user exists and belongs to the municipality
    let testUser = await User.findOne({ email: 'john@example.com' });
    if (!testUser) {
      testUser = await User.create({
        email: 'john@example.com',
        password: 'password123',
        role: 'citizen',
        municipality: municipality._id,
        profile: { firstName: 'John', lastName: 'Doe', phone: '+254700000000' }
      });
      console.log('✅ Created test user John Doe');
    } else if (!testUser.municipality) {
      testUser.municipality = municipality._id;
      await testUser.save();
      console.log('✅ Assigned municipality to test user John Doe');
    }

    // Find or create a hauler user
    let hauler = await User.findOne({ role: 'hauler', municipality: municipality._id });
    if (!hauler) {
      console.log('Creating hauler user...');
      hauler = await User.create({
        email: 'hauler@example.com',
        password: 'password123',
        role: 'hauler',
        municipality: municipality._id,
        profile: {
          firstName: 'James',
          lastName: 'Driver',
          phone: '+254712345678',
        },
      });
      console.log('✅ Hauler user created');
    }

    // Prepare sample route
    const routeData = {
      municipality: municipality._id,
      routeId: `RT-${Date.now()}-001`,
      name: 'CBD Morning Collection',
      hauler: hauler._id,
      vehicle: {
        id: 'VH-001',
        type: 'truck',
        licensePlate: 'KBZ 123A',
        capacity: 5000,
      },
      wasteType: 'recyclable',
      zone: 'Zone A - CBD',
      waypoints: [
        {
          address: 'Kenyatta Avenue, Nairobi',
          location: { type: 'Point', coordinates: [36.8219, -1.2864] },
          estimatedTime: new Date(Date.now() + 30 * 60 * 1000),
          status: 'pending',
        },
        {
          address: 'Moi Avenue, Nairobi',
          location: { type: 'Point', coordinates: [36.8196, -1.2854] },
          estimatedTime: new Date(Date.now() + 60 * 60 * 1000),
          status: 'pending',
        },
        {
          address: 'Uhuru Highway, Nairobi',
          location: { type: 'Point', coordinates: [36.8167, -1.2921] },
          estimatedTime: new Date(Date.now() + 90 * 60 * 1000),
          status: 'pending',
        },
      ],
      scheduledDate: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      status: 'planned', // matches getActiveRoutes filter
      startTime: null,
      currentLocation: { type: 'Point', coordinates: [36.8219, -1.2864] },
      lastLocationUpdate: null,
      efficiency: { plannedDistance: 15, actualDistance: 0, wasteCollected: 0 },
    };

    // Upsert route
    const existingRoute = await Route.findOne({ name: routeData.name, municipality: municipality._id });
    if (existingRoute) {
      await Route.updateOne({ _id: existingRoute._id }, { $set: routeData });
      console.log(`✅ Updated existing route: ${existingRoute.name}`);
    } else {
      await Route.create(routeData);
      console.log(`✅ Created new route: ${routeData.name}`);
    }

  } catch (error) {
    console.error('❌ Route seed error:', error);
    throw error;
  }
}

module.exports = seedRoutes;


