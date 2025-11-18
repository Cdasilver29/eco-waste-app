const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Public/Citizen routes
router.get('/active', authMiddleware, routeController.getActiveRoutes);
router.get('/:routeId', authMiddleware, routeController.getRouteDetails);
router.post('/:routeId/subscribe', authMiddleware, routeController.subscribeToRoute);

// Hauler routes
router.post('/', 
  authMiddleware, 
  roleCheck('hauler', 'admin', 'city_manager'), 
  routeController.createRoute
);
router.put('/:routeId/start', 
  authMiddleware, 
  roleCheck('hauler'), 
  routeController.startRoute
);
router.put('/:routeId/complete', 
  authMiddleware, 
  roleCheck('hauler'), 
  routeController.completeRoute
);

module.exports = router;
