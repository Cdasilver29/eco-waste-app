const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(authMiddleware);

// Image classification routes
router.post(
  '/classify',
  upload.single('image'),
  imageController.classifyImage
);

router.post(
  '/scan-and-log',
  upload.single('image'),
  imageController.scanAndLog
);

// Statistics
router.get('/history', imageController.getClassificationHistory);
router.get('/stats', imageController.getScanStats);

module.exports = router;
