const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['consensus', 'impact', 'narrative', 'forecast'],
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  aiModel: {
    type: String,
    default: 'gpt-4'
  },
  sources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source'
  }],
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

analysisSchema.index({ eventId: 1, analysisType: 1 });
analysisSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
