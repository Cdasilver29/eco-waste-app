// src/seed.js
require('dotenv').config();
const connectDB = require('./config/database');
const seedDatabase = require('./utils/seedData');
const seedBadges = require('./utils/seedBadges');
const seedRoutes = require('./utils/seedRoutes');

async function run() {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();

    console.log('\n🚀 Seeding core data...');
    await seedDatabase();

    console.log('\n🏅 Seeding badges...');
    await seedBadges();

    console.log('\n🛣️ Seeding routes...');
    await seedRoutes();

    console.log('\n🎉 All seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

run();

