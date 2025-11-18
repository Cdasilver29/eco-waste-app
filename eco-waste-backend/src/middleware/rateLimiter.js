const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// AI chat limiter (existing)
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    error: 'Too many chat messages. Please try again later.',
    retryAfter: '1 hour'
  },
  keyGenerator: (req) => {
    // Use user ID if logged in, otherwise fallback to IPv4/IPv6-safe IP
    return req.user ? req.user._id.toString() : ipKeyGenerator(req);
  }
});

// Image scan limiter - more restrictive due to higher costs
const imageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 image scans per hour
  message: {
    error: 'Too many image scans. Please try again later.',
    retryAfter: '1 hour'
  },
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : ipKeyGenerator(req);
  }
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests. Please try again later.'
  },
  keyGenerator: ipKeyGenerator // ensures IPv6-safe
});

module.exports = { chatLimiter, imageLimiter, apiLimiter };


