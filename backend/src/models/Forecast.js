const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  commodity: {
    type: String,
    required: true
  },
  currentPrice: Number,
  predictedPrice: Number,
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  timeframe: {
    type: String,
    enum: ['1day', '1week', '1month', '3months', '6months'],
    default: '1month'
  },
  modelUsed: {
    type: String,
    default: 'prophet'
  },
  data: {
    historicalPrices: [Number],
    factors: [String],
    trend: String
  },
  impactFactors: [{
    factor: String,
    weight: Number
  }]
}, {
  timestamps: true
});

forecastSchema.index({ commodity: 1, createdAt: -1 });
forecastSchema.index({ eventId: 1 });

module.exports = mongoose.model('Forecast', forecastSchema);
