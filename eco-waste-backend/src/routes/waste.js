const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.post('/log', authMiddleware, wasteController.logWaste);
router.get('/history', authMiddleware, wasteController.getWasteHistory);
router.get('/stats', authMiddleware, wasteController.getWasteStats);
router.get('/my-rank', authMiddleware, wasteController.getMyRank);

// Public routes
router.get('/leaderboard', wasteController.getLeaderboard);

module.exports = router;
