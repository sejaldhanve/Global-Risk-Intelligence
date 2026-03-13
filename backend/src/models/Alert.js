const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'demo'
  },
  watchlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watchlist',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  matchedBy: {
    countries: [String],
    domains: [String],
    riskLevels: [String],
    eventTypes: [String],
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

alertSchema.index({ userId: 1, status: 1, createdAt: -1 });
alertSchema.index({ watchlistId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Alert', alertSchema);
