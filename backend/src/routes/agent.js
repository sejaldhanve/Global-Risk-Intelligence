const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/query', agentController.query);
router.post('/process', agentController.processQuery);

module.exports = router;
