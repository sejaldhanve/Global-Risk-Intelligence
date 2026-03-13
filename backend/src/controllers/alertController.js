const Alert = require('../models/Alert');
const { DEMO_USER_ID, runAlertSweep } = require('../services/watchlist/watchlistService');

exports.getAlerts = async (req, res) => {
  try {
    const { status = 'all', limit = 50 } = req.query;
    const filter = { userId: DEMO_USER_ID };

    if (status !== 'all') {
      filter.status = status;
    }

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate('eventId')
      .populate('watchlistId');

    const unreadCount = await Alert.countDocuments({ userId: DEMO_USER_ID, status: 'unread' });

    res.json({
      success: true,
      alerts,
      unreadCount
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: DEMO_USER_ID },
      { status: 'read' },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Mark alert read error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAlertsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: DEMO_USER_ID, status: 'unread' },
      { status: 'read' }
    );

    res.json({
      success: true,
      message: 'All alerts marked as read'
    });
  } catch (error) {
    console.error('Mark all alerts read error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.triggerSweep = async (req, res) => {
  try {
    const result = await runAlertSweep();

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Trigger alert sweep error:', error);
    res.status(500).json({ error: error.message });
  }
};
