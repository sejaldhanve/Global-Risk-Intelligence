const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAlerts);
router.post('/sweep', alertController.triggerSweep);
router.patch('/read-all', alertController.markAllAlertsRead);
router.patch('/:id/read', alertController.markAlertRead);

module.exports = router;
