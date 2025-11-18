const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/facilities/nearby', authMiddleware, mapController.getNearbyFacilities);
router.post('/directions', authMiddleware, mapController.getDirections);

// Public routes
router.get('/geocode', mapController.geocodeAddress);
router.get('/reverse-geocode', mapController.reverseGeocode);

module.exports = router;
