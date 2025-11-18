const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Protected routes
router.get('/my-schedule', authMiddleware, scheduleController.getMySchedule);
router.get('/next-pickups', authMiddleware, scheduleController.getNextPickups);
router.post('/:scheduleId/subscribe', authMiddleware, scheduleController.subscribeToSchedule);
router.delete('/:scheduleId/subscribe', authMiddleware, scheduleController.unsubscribeFromSchedule);

// Public route
router.get('/zone/:zone', scheduleController.getScheduleByZone);

// Admin routes
router.post('/', 
  authMiddleware, 
  roleCheck('admin', 'city_manager'), 
  scheduleController.createSchedule
);

module.exports = router;
