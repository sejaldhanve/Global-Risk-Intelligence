const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

router.post('/', forecastController.generateForecast);
router.get('/', forecastController.getForecasts);

module.exports = router;
