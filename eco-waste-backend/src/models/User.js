const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Municipality = require('./Municipality');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['citizen', 'hauler', 'admin', 'city_manager'],
    default: 'citizen'
  },
  profile: {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    phone: String,
    avatar: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Kenya' },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
          validate: {
            validator: function (v) {
              return Array.isArray(v) && v.length === 2;
            },
            message: 'Coordinates must be an array of [longitude, latitude]'
          }
        }
      }
    }
  },

  // municipality MUST NOT be required, otherwise login and tests fail
  municipality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipality',
    required: false
  },

  gamification: {
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
      badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
      earnedAt: { type: Date, default: Date.now }
    }],
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: Date
    }
  },

  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      reminderHours: { type: Number, default: 12 }
    },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  },

  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  refreshTokens: [String]
}, { timestamps: true });

// Index for location
userSchema.index({ 'profile.address.coordinates': '2dsphere' });

// Hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Auto assign default municipality only on CREATE
userSchema.pre('save', async function(next) {
  if (!this.municipality) {
    const defaultMunicipality = await Municipality.findOne({});
    if (defaultMunicipality) {
      this.municipality = defaultMunicipality._id;
    }
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

module.exports = mongoose.model('User', userSchema);




