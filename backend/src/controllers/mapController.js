const mapService = require('../services/map/mapService');
const MapRegion = require('../models/MapRegion');

exports.geocode = async (req, res) => {
  try {
    const { country, region } = req.body;

    if (!country) {
      return res.status(400).json({ error: 'Country is required' });
    }

    const coordinates = await mapService.geocodeLocation(country, region);

    res.json({
      success: true,
      coordinates
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRegions = async (req, res) => {
  try {
    const { riskLevel } = req.query;

    let regions;
    if (riskLevel) {
      regions = await mapService.getRegionsByRisk(riskLevel);
    } else {
      regions = await mapService.getAllActiveRegions();
    }

    res.json({
      success: true,
      regions
    });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateRegionRisk = async (req, res) => {
  try {
    const { country, region, riskLevel } = req.body;

    if (!country || !region || !riskLevel) {
      return res.status(400).json({ error: 'Country, region, and riskLevel are required' });
    }

    await mapService.updateRegionRisk(country, region, riskLevel);

    res.json({
      success: true,
      message: 'Region risk updated successfully'
    });
  } catch (error) {
    console.error('Update region risk error:', error);
    res.status(500).json({ error: error.message });
  }
};
