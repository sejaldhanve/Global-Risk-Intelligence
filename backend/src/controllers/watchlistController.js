const Watchlist = require('../models/Watchlist');
const Alert = require('../models/Alert');
const {
  DEMO_USER_ID,
  normalizeFilters,
  getWatchlistPreviewEvents,
  runAlertSweep
} = require('../services/watchlist/watchlistService');

exports.createWatchlist = async (req, res) => {
  try {
    const { name, description = '', filters = {}, notificationChannels = ['in-app'] } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Watchlist name is required' });
    }

    const watchlist = await Watchlist.create({
      userId: DEMO_USER_ID,
      name: String(name).trim(),
      description,
      filters: normalizeFilters(filters),
      notificationChannels
    });

    await runAlertSweep();

    res.status(201).json({
      success: true,
      watchlist
    });
  } catch (error) {
    console.error('Create watchlist error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ userId: DEMO_USER_ID }).sort({ createdAt: -1 });

    res.json({
      success: true,
      watchlists
    });
  } catch (error) {
    console.error('Get watchlists error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateWatchlist = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.filters) {
      updates.filters = normalizeFilters(updates.filters);
    }

    if (updates.name) {
      updates.name = String(updates.name).trim();
    }

    const watchlist = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: DEMO_USER_ID },
      updates,
      { new: true, runValidators: true }
    );

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await runAlertSweep();

    res.json({
      success: true,
      watchlist
    });
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOneAndDelete({ _id: req.params.id, userId: DEMO_USER_ID });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await Alert.deleteMany({ watchlistId: watchlist._id });

    res.json({
      success: true,
      message: 'Watchlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete watchlist error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getWatchlistEvents = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ _id: req.params.id, userId: DEMO_USER_ID });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const limit = parseInt(req.query.limit || '20', 10);
    const events = await getWatchlistPreviewEvents(watchlist, limit);

    res.json({
      success: true,
      watchlist,
      events
    });
  } catch (error) {
    console.error('Get watchlist events error:', error);
    res.status(500).json({ error: error.message });
  }
};
