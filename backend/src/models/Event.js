const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  sources: [{
    url: String,
    title: String,
    snippet: String,
    publishedAt: Date,
    credibility: Number,
    rank: Number,
    domain: {
      type: String,
      enum: ['verified_news', 'economic_indicators', 'shipping_activity', 'energy_supply', 'logistics_networks', 'public_discourse', 'other']
    }
  }],
  domains: [{
    type: String,
    enum: ['verified_news', 'economic_indicators', 'shipping_activity', 'energy_supply', 'logistics_networks', 'public_discourse']
  }],
  impact: {
    sectors: [String],
    commodities: [String],
    tradeRoutes: [String],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    affectedCountries: [String]
  },
  forecast: {
    commodity: String,
    prediction: String,
    confidence: Number,
    timeframe: String,
    data: mongoose.Schema.Types.Mixed
  },
  summary: {
    text: String,
    confidence: Number,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    consensus: String
  },
  narrativeAnalysis: {
    isReal: {
      type: String,
      enum: ['real', 'fake', 'uncertain']
    },
    sentiment: String,
    confidence: Number
  },
  eventType: {
    type: String,
    enum: ['war', 'sanction', 'attack', 'trade_dispute', 'natural_disaster', 'political_crisis', 'other']
  },
  status: {
    type: String,
    enum: ['active', 'monitoring', 'resolved'],
    default: 'active'
  }
}, {
  timestamps: true
});

eventSchema.index({ country: 1, createdAt: -1 });
eventSchema.index({ 'summary.riskLevel': 1 });
eventSchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model('Event', eventSchema);
