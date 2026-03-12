const searchAggregator = require('../services/search/searchAggregator');
const sourceRanker = require('../services/search/sourceRanker');

exports.search = async (req, res) => {
  try {
    const { query, count = 10, sources = ['google', 'bing', 'newsapi'] } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await searchAggregator.aggregateSearch(query, { count, sources });

    const rankedResults = sourceRanker.rankSources(results);

    res.json({
      success: true,
      query,
      totalResults: rankedResults.length,
      results: rankedResults
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.rankSources = async (req, res) => {
  try {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'Sources array is required' });
    }

    const rankedSources = sourceRanker.rankSources(sources);

    res.json({
      success: true,
      totalSources: rankedSources.length,
      sources: rankedSources
    });
  } catch (error) {
    console.error('Ranking error:', error);
    res.status(500).json({ error: error.message });
  }
};
