const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

router.post('/consensus', analysisController.analyzeConsensus);
router.post('/extract', analysisController.extractEvent);
router.post('/narrative', analysisController.analyzeNarrative);
router.post('/impact', analysisController.analyzeImpact);
router.post('/full', analysisController.fullAnalysis);

module.exports = router;
