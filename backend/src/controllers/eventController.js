const Event = require('../models/Event');
const searchAggregator = require('../services/search/searchAggregator');
const sourceRanker = require('../services/search/sourceRanker');
const consensusEngine = require('../services/ai/consensusEngine');
const eventExtractor = require('../services/ai/eventExtractor');
const impactAnalyzer = require('../services/impact/impactAnalyzer');
const narrativeAnalyzer = require('../services/ai/narrativeAnalyzer');
const forecastService = require('../services/forecast/forecastService');
const mapService = require('../services/map/mapService');
const { classifySourceDomain, classifyEventDomains } = require('../services/domain/domainClassifier');

const DOMAIN_SEED_QUERIES = {
  verified_news: 'Major geopolitical conflict escalation and verified international responses',
  economic_indicators: 'Geopolitical tensions impact on inflation, oil prices, and global markets',
  shipping_activity: 'Maritime conflict impact on global shipping routes and ports',
  energy_supply: 'Conflict-related disruptions in global oil and natural gas supply',
  logistics_networks: 'War and sanctions impact on global supply chain and logistics networks',
  public_discourse: 'Global public sentiment and narrative shifts around major geopolitical conflicts'
};

const normalizeEventType = (type) => {
  const mapping = {
    war: 'war',
    conflict: 'war',
    invasion: 'war',
    attack: 'attack',
    strike: 'attack',
    bombing: 'attack',
    sanction: 'sanction',
    embargo: 'sanction',
    tariff: 'trade_dispute',
    trade: 'trade_dispute',
    dispute: 'trade_dispute',
    disaster: 'natural_disaster',
    earthquake: 'natural_disaster',
    flood: 'natural_disaster',
    crisis: 'political_crisis',
    coup: 'political_crisis'
  };

  if (!type || typeof type !== 'string') {
    return 'other';
  }

  const sanitized = type
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const token of sanitized) {
    if (mapping[token]) {
      return mapping[token];
    }
  }

  return 'other';
};

const createAndStoreEventFromQuery = async (query, options = {}) => {
  const { forceDomain } = options;

  const sources = await searchAggregator.aggregateSearch(query, { count: 15 });
  const rankedSources = sourceRanker.rankSources(sources);
  const topSources = rankedSources.slice(0, 10);

  const consensus = await consensusEngine.analyzeConsensus(topSources, query);
  const extractedEvent = await eventExtractor.extractEvent(query, topSources);

  const country = extractedEvent.country || 'Unknown';
  const region = extractedEvent.region || 'Unknown';

  const coordinates = await mapService.geocodeLocation(country, region);

  const impact = impactAnalyzer.analyzeImpact({
    ...extractedEvent,
    ...consensus,
    country,
    region
  });

  const narrative = await narrativeAnalyzer.analyzeNarrative(extractedEvent, topSources);

  const detectedDomains = classifyEventDomains(topSources);
  const domains = forceDomain
    ? Array.from(new Set([...detectedDomains, forceDomain]))
    : detectedDomains;

  const event = new Event({
    title: query,
    description: extractedEvent.description || consensus.summary || 'No description available',
    country,
    region,
    lat: coordinates.lat || 0,
    lng: coordinates.lng || 0,
    sources: topSources.map(s => ({
      url: s.url,
      title: s.title,
      snippet: s.snippet,
      publishedAt: s.publishedAt,
      credibility: s.credibilityScore,
      rank: s.rank,
      domain: classifySourceDomain(s)
    })),
    domains,
    impact,
    summary: {
      text: consensus.summary || 'Analysis in progress',
      confidence: consensus.confidence || 50,
      riskLevel: (consensus.riskLevel || 'medium').toLowerCase(),
      consensus: typeof consensus.consensus === 'string'
        ? consensus.consensus
        : JSON.stringify(consensus.consensus || 'Pending analysis')
    },
    narrativeAnalysis: {
      isReal: narrative.classification || 'uncertain',
      sentiment: narrative.sentiment || 'neutral',
      confidence: narrative.confidence || 50
    },
    eventType: normalizeEventType(extractedEvent.eventType),
    status: 'active'
  });

  await event.save();

  await mapService.saveMapRegion(
    country,
    region,
    coordinates,
    event._id
  );

  const forecast = await forecastService.generateForecast(extractedEvent, 'oil');
  await forecastService.saveForecast(event._id, forecast);

  return { event, forecast };
};

exports.createEvent = async (req, res) => {
  try {
    const { query, domain } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const { event, forecast } = await createAndStoreEventFromQuery(query, { forceDomain: domain });

    res.status(201).json({
      success: true,
      event,
      forecast
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { 
      country, 
      riskLevel, 
      status = 'active',
      domain,
      autoPopulate = 'false',
      limit = 50,
      page = 1
    } = req.query;

    const filter = {};
    if (country) filter.country = country;
    if (riskLevel) filter['summary.riskLevel'] = riskLevel;
    if (status) filter.status = status;
    if (domain) filter.domains = domain;

    let events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const shouldAutoPopulate = autoPopulate === 'true' || autoPopulate === true;

    if (shouldAutoPopulate && domain && domain !== 'all' && events.length === 0) {
      const seedQuery = DOMAIN_SEED_QUERIES[domain];

      if (seedQuery) {
        await createAndStoreEventFromQuery(seedQuery, { forceDomain: domain });

        events = await Event.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit));
      }
    }

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const forecasts = await forecastService.getForecastsByEvent(event._id);

    res.json({
      success: true,
      event,
      forecasts
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: error.message });
  }
};
