const express = require('express');
const router = express.Router();
const discourseController = require('../controllers/discourseController');

router.post('/aggregate', discourseController.aggregateDiscourse);
router.post('/narratives', discourseController.detectNarratives);

module.exports = router;
