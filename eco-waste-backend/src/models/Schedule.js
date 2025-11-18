const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  municipality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipality',
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  address: String,
  
  // Geographic location
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  },
  
  // Pickup schedules
  pickups: [{
    wasteType: {
      type: String,
      enum: ['recyclable', 'organic', 'e-waste', 'hazardous', 'general'],
      required: true
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6, // 0=Sunday, 6=Saturday
      required: true
    },
    time: {
      type: String,
      required: true // Format: "HH:MM"
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      default: 'weekly'
    },
    nextPickup: {
      type: Date,
      required: true
    }
  }],
  
  // Special collections
  specialCollections: [{
    type: {
      type: String,
      enum: ['bulk', 'hazardous', 'e-waste', 'other']
    },
    scheduledDate: Date,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    notes: String
  }],
  
  // Users subscribed to reminders
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes
scheduleSchema.index({ municipality: 1, zone: 1 });
scheduleSchema.index({ 'pickups.nextPickup': 1 });
scheduleSchema.index({ location: '2dsphere' });
scheduleSchema.index({ subscribers: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
