const axios = require('axios');
const Source = require('../../models/Source');

class SearchAggregator {
  constructor() {
    this.serpApiKey = process.env.SERPAPI_KEY;
    this.bingApiKey = process.env.BING_SEARCH_API_KEY;
    this.newsApiKey = process.env.NEWS_API_KEY;
  }

  async searchSerpAPI(query, count = 10) {
    if (!this.serpApiKey) {
      console.log('SerpAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          api_key: this.serpApiKey,
          q: query,
          engine: 'google',
          num: Math.min(count, 10),
          tbm: 'nws'
        }
      });

      const newsResults = response.data.news_results || [];
      
      return newsResults.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet || item.description || '',
        source: 'serpapi',
        domain: item.source || new URL(item.link).hostname,
        publishedAt: this.parsePublishedDate(item.published_at || item.date)
      }));
    } catch (error) {
      console.error('SerpAPI Search Error:', error.message);
      return [];
    }
  }

  async searchBing(query, count = 10) {
    if (!this.bingApiKey) {
      console.log('Bing API key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
        headers: {
          'Ocp-Apim-Subscription-Key': this.bingApiKey
        },
        params: {
          q: query,
          count: count,
          responseFilter: 'Webpages'
        }
      });

      return (response.data.webPages?.value || []).map(item => ({
        title: item.name,
        url: item.url,
        snippet: item.snippet,
        source: 'bing',
        publishedAt: item.dateLastCrawled || new Date(),
        domain: new URL(item.url).hostname
      }));
    } catch (error) {
      console.error('Bing Search Error:', error.message);
      return [];
    }
  }

  async searchNewsAPI(query, count = 10) {
    if (!this.newsApiKey) {
      console.log('NewsAPI key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          apiKey: this.newsApiKey,
          q: query,
          pageSize: count,
          sortBy: 'publishedAt',
          language: 'en'
        }
      });

      return (response.data.articles || []).map(item => ({
        title: item.title,
        url: item.url,
        snippet: item.description,
        content: item.content,
        source: 'newsapi',
        publishedAt: item.publishedAt,
        domain: item.source.name,
        author: item.author
      }));
    } catch (error) {
      console.error('NewsAPI Search Error:', error.message);
      return [];
    }
  }

  async aggregateSearch(query, options = {}) {
    const { count = 10, sources = ['serpapi', 'newsapi'] } = options;

    const searchPromises = [];

    if (sources.includes('serpapi')) {
      searchPromises.push(this.searchSerpAPI(query, count));
    }
    if (sources.includes('bing')) {
      searchPromises.push(this.searchBing(query, count));
    }
    if (sources.includes('newsapi')) {
      searchPromises.push(this.searchNewsAPI(query, count));
    }

    const results = await Promise.all(searchPromises);
    const combined = results.flat();

    const deduped = this.deduplicateResults(combined);
    
    await this.saveSources(deduped);

    return combined;
  }

  deduplicateResults(results) {
    const seen = new Set();
    const unique = [];

    for (const result of results) {
      const normalizedUrl = this.normalizeUrl(result.url);
      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        unique.push(result);
      }
    }

    return unique;
  }

  normalizeUrl(url) {
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  normalizeDomain(domain) {
    try {
      const parsed = new URL(domain);
      return parsed.hostname.toLowerCase();
    } catch {
      return domain.toLowerCase();
    }
  }

  async saveSources(results) {
    const savePromises = results.map(async (source) => {
      try {
        await Source.findOneAndUpdate(
          { url: source.url },
          {
            url: source.url,
            title: source.title,
            snippet: source.snippet,
            domain: this.normalizeDomain(source.domain),
            searchEngine: (source.source || 'serpapi').toLowerCase(),
            credibilityScore: source.credibilityScore || 50,
            publishedAt: source.publishedAt ? new Date(source.publishedAt) : new Date(),
            metadata: {
              author: source.author
            }
          },
          { upsert: true }
        );
      } catch (error) {
        console.error('Error saving source:', error.message);
      }
    });

    await Promise.allSettled(savePromises);
  }

  parsePublishedDate(dateString) {
    if (!dateString) {
      return new Date().toISOString();
    }

    const parsed = Date.parse(dateString);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }

    const relativeMatch = dateString.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
    if (relativeMatch) {
      const value = parseInt(relativeMatch[1], 10);
      const unit = relativeMatch[2].toLowerCase();
      const unitMs = {
        second: 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      };

      const offset = unitMs[unit] || unitMs.day;
      return new Date(Date.now() - value * offset).toISOString();
    }

    return new Date().toISOString();
  }
}

module.exports = new SearchAggregator();
