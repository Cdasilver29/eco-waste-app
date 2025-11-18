const mongoose = require('mongoose');

const municipalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Municipality name is required'],
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  country: {
    type: String,
    default: 'Kenya'
  },
  region: String,

  // Geographic boundary (for map display)
  boundary: {
    type: {
      type: String,
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of coordinates
      required: false
    }
  },

  // Configuration
  config: {
    wasteTypes: [{
      type: {
        type: String,
        enum: ['recyclable', 'organic', 'e-waste', 'hazardous', 'general'],
        required: true
      },
      color: String,
      icon: String,
      guidelines: String
    }],

    schedules: [{
      zone: String,
      wasteType: String,
      days: [Number], // 0=Sunday, 1=Monday, etc.
      time: String,
      frequency: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly'],
        default: 'weekly'
      }
    }],

    recyclingRules: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    holidays: [Date],

    contactInfo: {
      phone: String,
      email: String,
      website: String
    }
  },

  facilities: [{
    type: {
      type: String,
      enum: ['recycling_center', 'e-waste', 'compost', 'transfer_station', 'hazardous'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    address: String,
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    hours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },
    acceptedMaterials: [String],
    phone: String,
    notes: String
  }],

  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
// Removed duplicate slug index
municipalitySchema.index({ boundary: '2dsphere' });
municipalitySchema.index({ 'facilities.location': '2dsphere' });

// Generate slug from name
municipalitySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Municipality', municipalitySchema);
