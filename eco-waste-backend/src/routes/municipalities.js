const express = require('express');
const router = express.Router();
const municipalityController = require('../controllers/municipalityController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Public routes
router.get('/', municipalityController.getAllMunicipalities);
router.get('/:slug', municipalityController.getMunicipalityBySlug);
router.get('/:slug/waste-types', municipalityController.getWasteTypes);
router.get('/:slug/facilities', municipalityController.getNearbyFacilities);

// Admin routes
router.post('/', 
  authMiddleware, 
  roleCheck('admin', 'city_manager'), 
  municipalityController.createMunicipality
);

router.put('/:id', 
  authMiddleware, 
  roleCheck('admin', 'city_manager'), 
  municipalityController.updateMunicipality
);

module.exports = router;
