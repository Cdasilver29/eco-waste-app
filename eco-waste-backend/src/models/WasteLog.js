const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  municipality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipality',
    required: true
  },
  type: {
    type: String,
    enum: ['recyclable', 'organic', 'e-waste', 'hazardous', 'general'],
    required: true
  },
  category: {
    type: String, // Specific item: "plastic_bottle", "paper", etc.
    required: true
  },
  weight: {
    type: Number, // in kg
    default: 0
  },
  item: {
    type: String, // Description
    required: true
  },
  image: {
    type: String // URL to image
  },
  classification: {
    method: {
      type: String,
      enum: ['manual', 'ai_scan'],
      default: 'manual'
    },
    confidence: {
      type: Number, // 0-1 for AI classification
      min: 0,
      max: 1
    },
    suggestions: [String]
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [lng, lat]
    }
  },
  disposal: {
    method: {
      type: String,
      enum: ['curbside', 'drop_off', 'special_collection'],
      default: 'curbside'
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality.facilities'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
wasteLogSchema.index({ user: 1, createdAt: -1 });
wasteLogSchema.index({ municipality: 1, type: 1, createdAt: -1 });
wasteLogSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WasteLog', wasteLogSchema);
