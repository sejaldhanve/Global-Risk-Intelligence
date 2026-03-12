const mongoose = require('mongoose');

const mapRegionSchema = new mongoose.Schema({
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
  bounds: {
    northeast: {
      lat: Number,
      lng: Number
    },
    southwest: {
      lat: Number,
      lng: Number
    }
  },
  formattedAddress: String,
  placeId: String,
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  activeEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  metadata: {
    population: Number,
    economicImpact: String,
    strategicImportance: String
  }
}, {
  timestamps: true
});

mapRegionSchema.index({ country: 1, region: 1 });
mapRegionSchema.index({ lat: 1, lng: 1 });
mapRegionSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('MapRegion', mapRegionSchema);
