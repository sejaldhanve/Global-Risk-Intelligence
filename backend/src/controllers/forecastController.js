const forecastService = require('../services/forecast/forecastService');
const Forecast = require('../models/Forecast');

exports.generateForecast = async (req, res) => {
  try {
    const { eventData, commodity = 'oil' } = req.body;

    if (!eventData) {
      return res.status(400).json({ error: 'Event data is required' });
    }

    const forecast = await forecastService.generateForecast(eventData, commodity);

    res.json({
      success: true,
      forecast
    });
  } catch (error) {
    console.error('Forecast generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getForecasts = async (req, res) => {
  try {
    const { commodity, eventId, limit = 20 } = req.query;

    const filter = {};
    if (commodity) filter.commodity = commodity;
    if (eventId) filter.eventId = eventId;

    const forecasts = await Forecast.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('eventId');

    res.json({
      success: true,
      forecasts
    });
  } catch (error) {
    console.error('Get forecasts error:', error);
    res.status(500).json({ error: error.message });
  }
};
