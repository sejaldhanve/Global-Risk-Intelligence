const axios = require('axios');
const Forecast = require('../../models/Forecast');

class ForecastService {
  constructor() {
    this.pythonServiceUrl = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000';
  }

  async generateForecast(eventData, commodity = 'oil') {
    try {
      const mlForecast = await this.callPythonMLService(eventData, commodity);
      
      const ruleBased = this.ruleBasedForecast(eventData, commodity);
      
      const combined = this.combineForecast(mlForecast, ruleBased);
      
      return combined;
    } catch (error) {
      console.error('Forecast generation error:', error.message);
      return this.ruleBasedForecast(eventData, commodity);
    }
  }

  async callPythonMLService(eventData, commodity) {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/forecast`, {
        event: eventData.event || eventData.title,
        eventType: eventData.eventType,
        country: eventData.country,
        commodity,
        severity: eventData.risk || 'medium'
      }, {
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.log('Python ML service unavailable, using rule-based forecast');
      return null;
    }
  }

  ruleBasedForecast(eventData, commodity) {
    const eventType = eventData.eventType || 'other';
    const severity = eventData.risk || 'medium';

    const impactRules = {
      oil: {
        war: { critical: '+25%', high: '+15%', medium: '+8%', low: '+3%' },
        sanction: { critical: '+20%', high: '+12%', medium: '+6%', low: '+2%' },
        attack: { critical: '+18%', high: '+10%', medium: '+5%', low: '+2%' }
      },
      gas: {
        war: { critical: '+30%', high: '+18%', medium: '+10%', low: '+4%' },
        sanction: { critical: '+25%', high: '+15%', medium: '+8%', low: '+3%' },
        attack: { critical: '+20%', high: '+12%', medium: '+6%', low: '+2%' }
      },
      wheat: {
        war: { critical: '+35%', high: '+20%', medium: '+12%', low: '+5%' },
        natural_disaster: { critical: '+30%', high: '+18%', medium: '+10%', low: '+4%' }
      },
      shipping: {
        war: { critical: '+40%', high: '+25%', medium: '+15%', low: '+6%' },
        attack: { critical: '+35%', high: '+20%', medium: '+12%', low: '+5%' }
      }
    };

    const commodityRules = impactRules[commodity] || impactRules.oil;
    const eventRules = commodityRules[eventType] || commodityRules.war || {};
    const prediction = eventRules[severity] || '+5%';

    const confidence = this.calculateConfidence(eventData, commodity);

    return {
      commodity,
      prediction,
      confidence,
      timeframe: '1month',
      modelUsed: 'rule-based',
      factors: this.identifyFactors(eventData, commodity),
      trend: prediction.startsWith('+') ? 'increase' : 'decrease'
    };
  }

  combineForecast(mlForecast, ruleBased) {
    if (!mlForecast) {
      return ruleBased;
    }

    const mlConfidence = Number.isFinite(mlForecast.confidence) ? mlForecast.confidence : null;
    const ruleConfidence = Number.isFinite(ruleBased.confidence) ? ruleBased.confidence : null;

    let confidence;
    if (mlConfidence !== null && ruleConfidence !== null) {
      confidence = Math.round((mlConfidence + ruleConfidence) / 2);
    } else if (mlConfidence !== null) {
      confidence = mlConfidence;
    } else {
      confidence = ruleConfidence ?? 50;
    }

    return {
      commodity: ruleBased.commodity,
      prediction: mlForecast.prediction || ruleBased.prediction,
      confidence,
      timeframe: mlForecast.timeframe || ruleBased.timeframe,
      modelUsed: 'hybrid',
      factors: [...new Set([...(mlForecast.factors || []), ...ruleBased.factors])],
      trend: mlForecast.trend || ruleBased.trend,
      mlPrediction: mlForecast.prediction,
      ruleBasedPrediction: ruleBased.prediction
    };
  }

  calculateConfidence(eventData, commodity) {
    let confidence = 50;

    if (eventData.sources && eventData.sources.length > 10) {
      confidence += 20;
    } else if (eventData.sources && eventData.sources.length > 5) {
      confidence += 10;
    }

    if (eventData.summary && eventData.summary.confidence) {
      confidence = Math.round((confidence + eventData.summary.confidence) / 2);
    }

    const relevantCommodities = eventData.impact?.commodities || [];
    if (relevantCommodities.includes(commodity)) {
      confidence += 15;
    }

    return Math.min(100, Math.max(0, confidence));
  }

  identifyFactors(eventData, commodity) {
    const factors = [];

    if (eventData.eventType) {
      factors.push(`${eventData.eventType} event`);
    }

    if (eventData.country) {
      factors.push(`${eventData.country} involvement`);
    }

    if (eventData.impact?.sectors) {
      factors.push(...eventData.impact.sectors.map(s => `${s} sector impact`));
    }

    const commodityFactors = {
      oil: ['OPEC decisions', 'geopolitical tensions', 'supply disruptions'],
      gas: ['pipeline security', 'storage levels', 'winter demand'],
      wheat: ['harvest conditions', 'export restrictions', 'food security'],
      shipping: ['route security', 'insurance costs', 'alternative routes']
    };

    if (commodityFactors[commodity]) {
      factors.push(...commodityFactors[commodity]);
    }

    return factors.slice(0, 5);
  }

  async saveForecast(eventId, forecastData) {
    try {
      const forecast = new Forecast({
        eventId,
        commodity: forecastData.commodity,
        prediction: forecastData.prediction,
        confidence: forecastData.confidence,
        timeframe: forecastData.timeframe,
        modelUsed: forecastData.modelUsed,
        data: {
          factors: forecastData.factors,
          trend: forecastData.trend
        }
      });

      await forecast.save();
      return forecast;
    } catch (error) {
      console.error('Error saving forecast:', error.message);
      throw error;
    }
  }

  async getForecastsByEvent(eventId) {
    try {
      return await Forecast.find({ eventId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching forecasts:', error.message);
      return [];
    }
  }
}

module.exports = new ForecastService();
