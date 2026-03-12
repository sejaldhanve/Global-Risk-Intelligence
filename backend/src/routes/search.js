const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/', searchController.search);
router.post('/rank', searchController.rankSources);

module.exports = router;
