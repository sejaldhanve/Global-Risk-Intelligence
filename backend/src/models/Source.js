const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: String,
  snippet: String,
  domain: String,
  credibilityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  searchEngine: {
    type: String,
    enum: ['google', 'bing', 'newsapi']
  },
  publishedAt: Date,
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    author: String,
    language: String,
    country: String
  }
}, {
  timestamps: true
});

sourceSchema.index({ url: 1 });
sourceSchema.index({ credibilityScore: -1 });
sourceSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Source', sourceSchema);
