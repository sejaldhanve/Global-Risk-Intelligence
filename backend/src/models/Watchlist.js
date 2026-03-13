const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'demo'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  filters: {
    countries: [{ type: String }],
    domains: [{ type: String }],
    riskLevels: [{ type: String }],
    eventTypes: [{ type: String }],
    keywords: [{ type: String }]
  },
  notificationChannels: {
    type: [String],
    default: ['in-app']
  },
  lastNotifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

watchlistSchema.index({ userId: 1, createdAt: -1 });
watchlistSchema.index({ 'filters.countries': 1 });
watchlistSchema.index({ 'filters.domains': 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
