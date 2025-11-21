const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Helper to set token cookie if needed
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    if (!req.body.profile) req.body.profile = {};
    if (!req.body.profile.address) req.body.profile.address = {};

    if (!req.body.profile.address.coordinates) {
      req.body.profile.address.coordinates = {
        type: 'Point',
        coordinates: [0, 0]
      };
    }

    const userData = await authController.register(req);

    if (userData.token) setTokenCookie(res, userData.token);

    return res.status(201).json({
      message: 'User registered successfully',
      user: userData.user,
      token: userData.token,
      refreshToken: userData.refreshToken
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const userData = await authController.login(req);

    if (userData.token) setTokenCookie(res, userData.token);

    return res.status(200).json({
      message: 'Login successful',
      user: userData.user,
      token: userData.token,
      refreshToken: userData.refreshToken
    });
  } catch (err) {
    next(err);
  }
});

// PROTECTED ROUTES
router.get('/me', authMiddleware, authController.getMe);

router.post('/logout', authMiddleware, authController.logout);

module.exports = router;


