const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.post('/', watchlistController.createWatchlist);
router.get('/', watchlistController.getWatchlists);
router.get('/:id/events', watchlistController.getWatchlistEvents);
router.put('/:id', watchlistController.updateWatchlist);
router.delete('/:id', watchlistController.deleteWatchlist);

module.exports = router;
