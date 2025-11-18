const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  municipality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipality',
    required: true
  },
  routeId: {
    type: String,
    required: true,
    unique: true // This automatically creates a unique index
  },
  name: {
    type: String,
    required: true
  },
  hauler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    id: String,
    type: {
      type: String,
      enum: ['truck', 'van', 'compact'],
      default: 'truck'
    },
    licensePlate: String,
    capacity: Number
  },
  wasteType: {
    type: String,
    enum: ['recyclable', 'organic', 'e-waste', 'hazardous', 'general'],
    required: true
  },
  zone: String,
  waypoints: [{
    address: String,
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    estimatedTime: Date,
    actualTime: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped', 'in_progress'],
      default: 'pending'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: Date,
  endTime: Date,
  currentLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  lastLocationUpdate: Date,
  efficiency: {
    plannedDistance: Number,
    actualDistance: Number,
    fuelUsed: Number,
    wasteCollected: Number,
    timeOnRoute: Number
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes
routeSchema.index({ municipality: 1, scheduledDate: 1 });
routeSchema.index({ hauler: 1, status: 1 });
routeSchema.index({ currentLocation: '2dsphere' });
routeSchema.index({ 'waypoints.location': '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);
