const agentService = require('../services/agent/agentService');

exports.query = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await agentService.answerQuestion(question);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Agent query error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.processQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await agentService.processQuery(query);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Agent process error:', error);
    res.status(500).json({ error: error.message });
  }
};
