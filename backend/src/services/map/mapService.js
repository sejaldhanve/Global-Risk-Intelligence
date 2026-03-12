const axios = require('axios');
const MapRegion = require('../../models/MapRegion');

class MapService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async geocodeLocation(country, region = '') {
    if (!this.googleMapsApiKey) {
      console.log('Google Maps API key not configured, using fallback coordinates');
      return this.getFallbackCoordinates(country);
    }

    try {
      const address = region ? `${region}, ${country}` : country;
      
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: this.googleMapsApiKey
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          bounds: result.geometry.bounds || result.geometry.viewport
        };
      }

      return this.getFallbackCoordinates(country);
    } catch (error) {
      console.error('Geocoding error:', error.message);
      return this.getFallbackCoordinates(country);
    }
  }

  getFallbackCoordinates(country) {
    const coordinates = {
      'Ukraine': { lat: 50.4501, lng: 30.5234 },
      'Russia': { lat: 55.7558, lng: 37.6173 },
      'Iran': { lat: 35.6892, lng: 51.3890 },
      'Israel': { lat: 31.7683, lng: 35.2137 },
      'Palestine': { lat: 31.9522, lng: 35.2332 },
      'China': { lat: 39.9042, lng: 116.4074 },
      'Taiwan': { lat: 25.0330, lng: 121.5654 },
      'Syria': { lat: 33.5138, lng: 36.2765 },
      'Yemen': { lat: 15.5527, lng: 48.5164 },
      'Iraq': { lat: 33.3152, lng: 44.3661 },
      'Saudi Arabia': { lat: 24.7136, lng: 46.6753 },
      'UAE': { lat: 24.4539, lng: 54.3773 },
      'India': { lat: 28.6139, lng: 77.2090 },
      'Pakistan': { lat: 33.6844, lng: 73.0479 },
      'Afghanistan': { lat: 34.5553, lng: 69.2075 },
      'North Korea': { lat: 39.0392, lng: 125.7625 },
      'South Korea': { lat: 37.5665, lng: 126.9780 },
      'Japan': { lat: 35.6762, lng: 139.6503 },
      'Unknown': { lat: 0, lng: 0 }
    };

    return coordinates[country] || { lat: 0, lng: 0 };
  }

  async saveMapRegion(country, region, coordinates, eventId = null) {
    try {
      const mapRegion = await MapRegion.findOneAndUpdate(
        { country, region },
        {
          lat: coordinates.lat,
          lng: coordinates.lng,
          formattedAddress: coordinates.formattedAddress,
          placeId: coordinates.placeId,
          bounds: coordinates.bounds,
          $addToSet: eventId ? { activeEvents: eventId } : {}
        },
        { upsert: true, new: true }
      );

      return mapRegion;
    } catch (error) {
      console.error('Error saving map region:', error.message);
      throw error;
    }
  }

  async updateRegionRisk(country, region, riskLevel) {
    try {
      await MapRegion.findOneAndUpdate(
        { country, region },
        { riskLevel },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error updating region risk:', error.message);
    }
  }

  async getRegionsByRisk(riskLevel) {
    try {
      return await MapRegion.find({ riskLevel }).populate('activeEvents');
    } catch (error) {
      console.error('Error fetching regions by risk:', error.message);
      return [];
    }
  }

  async getAllActiveRegions() {
    try {
      return await MapRegion.find({
        activeEvents: { $exists: true, $ne: [] }
      }).populate('activeEvents');
    } catch (error) {
      console.error('Error fetching active regions:', error.message);
      return [];
    }
  }

  calculateRegionBounds(lat, lng, radiusKm = 100) {
    const earthRadius = 6371;
    
    const latDelta = (radiusKm / earthRadius) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {
      northeast: {
        lat: lat + latDelta,
        lng: lng + lngDelta
      },
      southwest: {
        lat: lat - latDelta,
        lng: lng - lngDelta
      }
    };
  }
}

module.exports = new MapService();
