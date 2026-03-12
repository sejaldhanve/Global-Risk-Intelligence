const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.post('/geocode', mapController.geocode);
router.get('/regions', mapController.getRegions);
router.put('/regions/risk', mapController.updateRegionRisk);

module.exports = router;
