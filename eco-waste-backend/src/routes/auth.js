const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Helper to set token cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in prod
    sameSite: 'None', // required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Public routes
router.post('/register', async (req, res, next) => {
  try {
    // Ensure address coordinates exist
    if (!req.body.profile) req.body.profile = {};
    if (!req.body.profile.address) req.body.profile.address = {};
    if (!req.body.profile.address.coordinates) {
      req.body.profile.address.coordinates = { type: 'Point', coordinates: [0, 0] };
    } else {
      // Ensure type is Point
      req.body.profile.address.coordinates.type = 'Point';
      // Ensure coordinates is an array
      if (!Array.isArray(req.body.profile.address.coordinates.coordinates)) {
        req.body.profile.address.coordinates.coordinates = [0, 0];
      }
    }

    const userData = await authController.register(req, res, next);

    // Set token cookie if controller returns a token
    if (userData?.token) setTokenCookie(res, userData.token);

    res.status(201).json({
      message: 'User registered successfully',
      user: userData.user
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const userData = await authController.login(req, res, next);

    if (userData?.token) setTokenCookie(res, userData.token);

    res.status(200).json({
      message: 'Login successful',
      user: userData.user
    });
  } catch (err) {
    next(err);
  }
});

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
