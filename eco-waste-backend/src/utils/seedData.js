// src/utils/seedData.js
const slugify = require('slugify');
const Municipality = require('../models/Municipality');
const Schedule = require('../models/Schedule');
const User = require('../models/User');

const sampleMunicipality = {
  name: 'Nairobi',
  slug: slugify('Nairobi', { lower: true, strict: true }),
  country: 'Kenya',
  region: 'Nairobi County',
  config: {
    wasteTypes: [
      { type: 'recyclable', color: '#2196F3', icon: '♻️', guidelines: 'Clean and dry recyclables: plastic bottles, paper, cardboard, glass, aluminum cans' },
      { type: 'organic', color: '#4CAF50', icon: '🌱', guidelines: 'Food scraps, yard waste, compostable materials' },
      { type: 'e-waste', color: '#FF9800', icon: '💻', guidelines: 'Electronics, batteries, light bulbs - take to designated e-waste facilities' },
      { type: 'hazardous', color: '#F44336', icon: '⚠️', guidelines: 'Chemicals, paint, oils - special handling required' },
      { type: 'general', color: '#9E9E9E', icon: '🗑️', guidelines: 'Non-recyclable waste' },
    ],
    recyclingRules: {
      plastics: { accepted: ['PET #1', 'HDPE #2', 'PP #5'], rejected: ['Plastic bags', 'Styrofoam', 'PVC #3'] },
      paper: { accepted: ['Newspapers', 'Magazines', 'Cardboard', 'Office paper'], rejected: ['Waxed paper', 'Tissue paper', 'Pizza boxes with grease'] },
      glass: { accepted: ['Bottles', 'Jars'], rejected: ['Window glass', 'Light bulbs', 'Mirrors'] },
    },
    contactInfo: { phone: '+254-700-123456', email: 'waste@nairobi.go.ke', website: 'https://nairobi.go.ke/waste' },
  },
  facilities: [
    {
      type: 'recycling_center',
      name: 'Nairobi Recycling Hub',
      address: 'Industrial Area, Nairobi',
      location: { type: 'Point', coordinates: [36.8219, -1.3194] },
      hours: { monday: '08:00-17:00', tuesday: '08:00-17:00', wednesday: '08:00-17:00', thursday: '08:00-17:00', friday: '08:00-17:00', saturday: '09:00-13:00', sunday: 'Closed' },
      acceptedMaterials: ['plastic', 'paper', 'cardboard', 'glass', 'metal'],
      phone: '+254-700-111222',
    },
    {
      type: 'e-waste',
      name: 'E-Waste Collection Point',
      address: 'Westlands, Nairobi',
      location: { type: 'Point', coordinates: [36.8095, -1.2664] },
      hours: { monday: '09:00-16:00', tuesday: '09:00-16:00', wednesday: '09:00-16:00', thursday: '09:00-16:00', friday: '09:00-16:00', saturday: 'Closed', sunday: 'Closed' },
      acceptedMaterials: ['computers', 'phones', 'batteries', 'appliances'],
      phone: '+254-700-333444',
    },
  ],
};

const sampleSchedules = [
  {
    zone: 'Zone A - CBD',
    pickups: [
      { wasteType: 'recyclable', dayOfWeek: 2, time: '08:00', frequency: 'weekly' },
      { wasteType: 'organic', dayOfWeek: 4, time: '08:00', frequency: 'weekly' },
      { wasteType: 'general', dayOfWeek: 1, time: '07:00', frequency: 'weekly' },
    ],
  },
  {
    zone: 'Zone B - Westlands',
    pickups: [
      { wasteType: 'recyclable', dayOfWeek: 3, time: '09:00', frequency: 'weekly' },
      { wasteType: 'organic', dayOfWeek: 5, time: '09:00', frequency: 'weekly' },
      { wasteType: 'general', dayOfWeek: 2, time: '08:00', frequency: 'weekly' },
    ],
  },
];

async function seedDatabase() {
  try {
    // 1️⃣ Ensure municipality exists
    let municipality = await Municipality.findOne({ name: 'Nairobi' });
    if (!municipality) {
      municipality = await Municipality.create(sampleMunicipality);
      console.log('✅ Municipality created:', municipality.name);
    } else {
      console.log('✅ Municipality already exists');
    }

    // 2️⃣ Ensure test user exists for login
    let user = await User.findOne({ email: 'john@example.com' });
    if (!user) {
      user = await User.create({
        email: 'john@example.com',
        password: 'password123',
        role: 'citizen',
        municipality: municipality._id,
        profile: { firstName: 'John', lastName: 'Doe' },
      });
      console.log('✅ Test user created:', user.email);
    } else {
      console.log('✅ Test user already exists');
      // If user exists but doesn't have municipality, update it
      if (!user.municipality) {
        user.municipality = municipality._id;
        await user.save();
        console.log('✅ Updated user with municipality');
      }
    }
 

    // 3️⃣ Create schedules if none exist
    const existingSchedules = await Schedule.find({ municipality: municipality._id });
    if (existingSchedules.length === 0) {
      for (const scheduleData of sampleSchedules) {
        const pickupsWithDates = scheduleData.pickups.map((pickup) => ({
          ...pickup,
          nextPickup: calculateNextPickup(pickup.dayOfWeek, pickup.frequency),
        }));
        await Schedule.create({
          municipality: municipality._id,
          zone: scheduleData.zone,
          pickups: pickupsWithDates,
        });
      }
      console.log('✅ Schedules created');
    } else {
      console.log('✅ Schedules already exist');
    }

    console.log('✅ Sample data seeding complete!');
    return municipality;
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

function calculateNextPickup(dayOfWeek, frequency) {
  const today = new Date();
  const currentDay = today.getDay();
  let daysUntilNext = (dayOfWeek - currentDay + 7) % 7;
  if (daysUntilNext === 0) daysUntilNext = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

module.exports = seedDatabase;


