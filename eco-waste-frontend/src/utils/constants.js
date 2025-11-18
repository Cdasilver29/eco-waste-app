// src/utils/constants.js

export const WASTE_TYPES = {
  RECYCLABLE: 'recyclable',
  ORGANIC: 'organic',
  GENERAL: 'general',
  HAZARDOUS: 'hazardous'
};

export const WASTE_CATEGORIES = {
  recyclable: ['Plastic', 'Paper', 'Glass', 'Metal', 'Cardboard', 'Electronics'],
  organic: ['Food Scraps', 'Garden Waste', 'Compostable', 'Biodegradable'],
  general: ['Mixed Waste', 'Non-recyclable'],
  hazardous: ['Batteries', 'Electronics', 'Chemicals', 'Medical Waste', 'Paint']
};

export const POINTS_CONFIG = {
  recyclable: 10,
  organic: 8,
  general: 5,
  hazardous: 15
};

export const BADGES = [
  {
    id: 'first-step',
    name: 'First Step',
    icon: '🌱',
    description: 'Log your first waste',
    criteria: { wasteLogsCount: 1 },
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    icon: '🔥',
    description: 'Maintain 7 day streak',
    criteria: { streakDays: 7 },
    color: 'from-orange-400 to-red-600'
  },
  {
    id: 'eco-master',
    name: 'Eco Master',
    icon: '🏆',
    description: 'Earn 1000 points',
    criteria: { totalPoints: 1000 },
    color: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'green-guru',
    name: 'Green Guru',
    icon: '🧘',
    description: 'Use AI assistant 50 times',
    criteria: { aiUsageCount: 50 },
    color: 'from-purple-400 to-indigo-600'
  },
  {
    id: 'recycling-champion',
    name: 'Recycling Champion',
    icon: '♻️',
    description: 'Recycle 500kg of waste',
    criteria: { totalWeight: 500 },
    color: 'from-blue-400 to-cyan-600'
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    icon: '👑',
    description: 'Reach top 10 in leaderboard',
    criteria: { rank: 10 },
    color: 'from-pink-400 to-rose-600'
  },
  {
    id: 'impact-maker',
    name: 'Impact Maker',
    icon: '🌍',
    description: 'Save 1 ton of CO₂',
    criteria: { co2Saved: 1000 },
    color: 'from-teal-400 to-green-600'
  },
  {
    id: 'perfect-month',
    name: 'Perfect Month',
    icon: '⭐',
    description: 'Maintain 30 day streak',
    criteria: { streakDays: 30 },
    color: 'from-amber-400 to-orange-600'
  }
];

export const USER_ROLES = {
  CITIZEN: 'citizen',
  HAULER: 'hauler',
  ADMIN: 'admin',
  MUNICIPALITY: 'municipality'
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile'
  },
  WASTE: {
    LOG: '/waste/log',
    HISTORY: '/waste/history',
    STATS: '/waste/stats',
    LEADERBOARD: '/waste/leaderboard',
    MY_RANK: '/waste/my-rank'
  },
  CHAT: {
    SESSION: '/chat/session',
    MESSAGE: '/chat/message',
    HISTORY: '/chat/history'
  },
  IMAGE: {
    CLASSIFY: '/image/classify',
    SCAN_AND_LOG: '/image/scan-and-log'
  },
  MAPS: {
    NEARBY_FACILITIES: '/maps/nearby-facilities',
    DIRECTIONS: '/maps/directions',
    GEOCODE: '/maps/geocode'
  },
  ROUTES: {
    ACTIVE: '/routes/active',
    DETAILS: '/routes/:id',
    UPDATE_LOCATION: '/routes/:id/location'
  },
  SCHEDULES: {
    MY_SCHEDULE: '/schedules/my-schedule',
    NEXT_PICKUPS: '/schedules/next-pickups',
    SUBSCRIBE: '/schedules/:id/subscribe'
  },
  MUNICIPALITIES: {
    LIST: '/municipalities',
    DETAILS: '/municipalities/:slug',
    WASTE_TYPES: '/municipalities/:slug/waste-types',
    FACILITIES: '/municipalities/:slug/facilities'
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',
  LOCATION_DENIED: 'Location access denied. Please enable location services.',
  CAMERA_DENIED: 'Camera access denied. Please enable camera permissions.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! 🎉',
  REGISTER_SUCCESS: 'Account created successfully! Welcome to EcoWaste! 🌱',
  WASTE_LOGGED: 'Waste logged successfully! Keep up the great work! ♻️',
  PROFILE_UPDATED: 'Profile updated successfully! ✅',
  PASSWORD_CHANGED: 'Password changed successfully! 🔒',
  BADGE_EARNED: 'Congratulations! You earned a new badge! 🏆',
  LEVEL_UP: 'Level up! You\'re making amazing progress! 🚀',
  STREAK_MAINTAINED: 'Streak maintained! Keep going! 🔥'
};

export const COLORS = {
  primary: {
    emerald: '#10b981',
    teal: '#14b8a6'
  },
  waste: {
    recyclable: '#10b981',
    organic: '#84cc16',
    general: '#64748b',
    hazardous: '#ef4444'
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

export const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 99, title: 'Eco Newbie', icon: '🌱' },
  { level: 2, minPoints: 100, maxPoints: 249, title: 'Green Apprentice', icon: '🌿' },
  { level: 3, minPoints: 250, maxPoints: 499, title: 'Recycling Novice', icon: '♻️' },
  { level: 4, minPoints: 500, maxPoints: 999, title: 'Eco Enthusiast', icon: '🌳' },
  { level: 5, minPoints: 1000, maxPoints: 1999, title: 'Green Warrior', icon: '⚔️' },
  { level: 6, minPoints: 2000, maxPoints: 3499, title: 'Sustainability Expert', icon: '🎓' },
  { level: 7, minPoints: 3500, maxPoints: 4999, title: 'Eco Master', icon: '🧘' },
  { level: 8, minPoints: 5000, maxPoints: 7499, title: 'Green Guardian', icon: '🛡️' },
  { level: 9, minPoints: 7500, maxPoints: 9999, title: 'Earth Legend', icon: '⭐' },
  { level: 10, minPoints: 10000, maxPoints: Infinity, title: 'Eco Champion', icon: '👑' }
];

export const MUNICIPALITIES = [
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya' },
  { id: 'mombasa', name: 'Mombasa', country: 'Kenya' },
  { id: 'kisumu', name: 'Kisumu', country: 'Kenya' },
  { id: 'nakuru', name: 'Nakuru', country: 'Kenya' },
  { id: 'eldoret', name: 'Eldoret', country: 'Kenya' }
];

export const PICKUP_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi-weekly',
  MONTHLY: 'monthly'
};

export const FACILITY_TYPES = {
  RECYCLING_CENTER: 'recycling',
  DROP_OFF: 'dropoff',
  PROCESSING_PLANT: 'processing',
  COLLECTION_POINT: 'collection'
};

export const ROUTE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const DATE_FORMATS = {
  SHORT: 'short',
  LONG: 'long',
  TIME: 'time',
  DATETIME: 'datetime'
};

export const STORAGE_KEYS = {
  TOKEN: 'eco_token',
  USER: 'eco_user',
  THEME: 'eco_theme',
  LANGUAGE: 'eco_language',
  LOCATION: 'eco_location',
  MUNICIPALITY: 'eco_municipality'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

export const IMPACT_METRICS = {
  CO2_PER_KG: 2.5, // kg CO2 saved per kg waste recycled
  TREES_PER_TON: 17, // trees saved per ton of paper recycled
  WATER_PER_KG: 50, // liters of water saved per kg waste recycled
  ENERGY_PER_KG: 5 // kWh saved per kg waste recycled
};

export const STREAK_BONUSES = {
  7: 1.1,   // 10% bonus for 7 day streak
  14: 1.2,  // 20% bonus for 14 day streak
  30: 1.5,  // 50% bonus for 30 day streak
  90: 2.0   // 100% bonus for 90 day streak
};

export const REFERRAL_BONUS = 100; // Points for referring a friend
export const DAILY_LOGIN_BONUS = 5; // Points for daily login

export default {
  WASTE_TYPES,
  WASTE_CATEGORIES,
  POINTS_CONFIG,
  BADGES,
  USER_ROLES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLORS,
  LEVELS,
  MUNICIPALITIES,
  PICKUP_FREQUENCIES,
  FACILITY_TYPES,
  ROUTE_STATUS,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  NOTIFICATION_TYPES,
  IMPACT_METRICS,
  STREAK_BONUSES,
  REFERRAL_BONUS,
  DAILY_LOGIN_BONUS
};