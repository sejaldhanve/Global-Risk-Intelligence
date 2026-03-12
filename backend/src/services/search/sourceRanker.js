class SourceRanker {
  constructor() {
    this.credibilityMap = {
      'reuters.com': 95,
      'apnews.com': 95,
      'bbc.com': 90,
      'cnn.com': 85,
      'nytimes.com': 90,
      'wsj.com': 90,
      'theguardian.com': 85,
      'aljazeera.com': 80,
      'bloomberg.com': 90,
      'ft.com': 90
    };
  }

  rankSources(sources) {
    const rankedSources = sources.map(source => {
      const score = this.calculateScore(source, sources);
      return {
        ...source,
        credibilityScore: score.credibility,
        frequencyScore: score.frequency,
        recencyScore: score.recency,
        totalScore: score.total,
        rank: 0
      };
    });

    rankedSources.sort((a, b) => b.totalScore - a.totalScore);

    rankedSources.forEach((source, index) => {
      source.rank = index + 1;
    });

    return rankedSources;
  }

  calculateScore(source, allSources) {
    const credibility = this.getCredibilityScore(source);
    const frequency = this.getFrequencyScore(source, allSources);
    const recency = this.getRecencyScore(source);
    const similarity = this.getSimilarityScore(source, allSources);

    const total = (
      credibility * 0.4 +
      frequency * 0.25 +
      recency * 0.2 +
      similarity * 0.15
    );

    return {
      credibility,
      frequency,
      recency,
      similarity,
      total
    };
  }

  getCredibilityScore(source) {
    const domain = source.domain || this.extractDomain(source.url);
    return this.credibilityMap[domain] || 50;
  }

  getFrequencyScore(source, allSources) {
    const domain = source.domain || this.extractDomain(source.url);
    const count = allSources.filter(s => {
      const sDomain = s.domain || this.extractDomain(s.url);
      return sDomain === domain;
    }).length;

    return Math.min(100, count * 20);
  }

  getRecencyScore(source) {
    const publishedAt = new Date(source.publishedAt);
    const now = new Date();
    const hoursDiff = (now - publishedAt) / (1000 * 60 * 60);

    if (hoursDiff < 1) return 100;
    if (hoursDiff < 6) return 90;
    if (hoursDiff < 24) return 80;
    if (hoursDiff < 72) return 60;
    if (hoursDiff < 168) return 40;
    return 20;
  }

  getSimilarityScore(source, allSources) {
    const sourceWords = this.extractKeywords(source.title + ' ' + source.snippet);
    
    let matchCount = 0;
    allSources.forEach(other => {
      if (other.url === source.url) return;
      
      const otherWords = this.extractKeywords(other.title + ' ' + other.snippet);
      const intersection = sourceWords.filter(word => otherWords.includes(word));
      
      if (intersection.length > 3) {
        matchCount++;
      }
    });

    return Math.min(100, matchCount * 15);
  }

  extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  filterTopSources(rankedSources, limit = 20) {
    return rankedSources.slice(0, limit);
  }
}

module.exports = new SourceRanker();
