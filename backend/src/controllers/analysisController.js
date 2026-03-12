const consensusEngine = require('../services/ai/consensusEngine');
const eventExtractor = require('../services/ai/eventExtractor');
const narrativeAnalyzer = require('../services/ai/narrativeAnalyzer');
const impactAnalyzer = require('../services/impact/impactAnalyzer');
const Event = require('../models/Event');

exports.analyzeConsensus = async (req, res) => {
  try {
    const { sources, query } = req.body;

    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'Sources array is required' });
    }

    const consensus = await consensusEngine.analyzeConsensus(sources, query);

    res.json({
      success: true,
      consensus
    });
  } catch (error) {
    console.error('Consensus analysis error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.extractEvent = async (req, res) => {
  try {
    const { text, sources = [] } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const extractedEvent = await eventExtractor.extractEvent(text, sources);

    res.json({
      success: true,
      event: extractedEvent
    });
  } catch (error) {
    console.error('Event extraction error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeNarrative = async (req, res) => {
  try {
    const { eventData, sources } = req.body;

    if (!eventData || !sources) {
      return res.status(400).json({ error: 'Event data and sources are required' });
    }

    const narrative = await narrativeAnalyzer.analyzeNarrative(eventData, sources);

    res.json({
      success: true,
      narrative
    });
  } catch (error) {
    console.error('Narrative analysis error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeImpact = async (req, res) => {
  try {
    const { eventData } = req.body;

    if (!eventData) {
      return res.status(400).json({ error: 'Event data is required' });
    }

    const impact = impactAnalyzer.analyzeImpact(eventData);

    res.json({
      success: true,
      impact
    });
  } catch (error) {
    console.error('Impact analysis error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.fullAnalysis = async (req, res) => {
  try {
    const { query, sources } = req.body;

    if (!query || !sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'Query and sources are required' });
    }

    const consensus = await consensusEngine.analyzeConsensus(sources, query);
    
    const extractedEvent = await eventExtractor.extractEvent(query, sources);
    
    const impact = impactAnalyzer.analyzeImpact({
      ...extractedEvent,
      ...consensus
    });
    
    const narrative = await narrativeAnalyzer.analyzeNarrative(extractedEvent, sources);

    res.json({
      success: true,
      analysis: {
        consensus,
        event: extractedEvent,
        impact,
        narrative
      }
    });
  } catch (error) {
    console.error('Full analysis error:', error);
    res.status(500).json({ error: error.message });
  }
};
