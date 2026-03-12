const discourseAggregator = require('../services/discourse/discourseAggregator');

exports.aggregateDiscourse = async (req, res) => {
  try {
    const { query, limit } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await discourseAggregator.aggregatePublicDiscourse(query, { limit });

    res.json(result);
  } catch (error) {
    console.error('Discourse aggregation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.detectNarratives = async (req, res) => {
  try {
    const { discourseData } = req.body;

    if (!discourseData || !Array.isArray(discourseData)) {
      return res.status(400).json({ error: 'Discourse data array is required' });
    }

    const narratives = discourseAggregator.detectNarratives(discourseData);

    res.json({
      success: true,
      narratives
    });
  } catch (error) {
    console.error('Narrative detection error:', error);
    res.status(500).json({ error: error.message });
  }
};
