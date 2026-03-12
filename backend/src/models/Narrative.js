const mongoose = require('mongoose');

const narrativeSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  narrativeText: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral', 'mixed']
  },
  classification: {
    type: String,
    enum: ['real', 'fake', 'uncertain'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  evidenceSources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source'
  }],
  contradictingSources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source'
  }],
  realDataPoints: [{
    metric: String,
    value: mongoose.Schema.Types.Mixed,
    source: String
  }],
  analysis: {
    keyPoints: [String],
    inconsistencies: [String],
    verification: String
  }
}, {
  timestamps: true
});

narrativeSchema.index({ eventId: 1 });
narrativeSchema.index({ classification: 1 });
narrativeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Narrative', narrativeSchema);
