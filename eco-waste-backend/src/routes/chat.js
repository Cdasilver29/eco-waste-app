const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

// All chat routes require authentication
router.use(authMiddleware);

// Chat operations
router.post('/session', chatController.createSession);
router.post('/message', chatController.sendMessage);
router.post('/feedback', chatController.provideFeedback);
router.post('/end-session', chatController.endSession);

// History and stats
router.get('/history', chatController.getChatHistory);
router.get('/stats', chatController.getChatStats);

module.exports = router;