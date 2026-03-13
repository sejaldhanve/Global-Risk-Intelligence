const Event = require('../../models/Event');
const Watchlist = require('../../models/Watchlist');
const Alert = require('../../models/Alert');

const DEMO_USER_ID = 'demo';

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  return [String(value).trim()].filter(Boolean);
};

const normalizeFilters = (filters = {}) => ({
  countries: normalizeArray(filters.countries),
  domains: normalizeArray(filters.domains),
  riskLevels: normalizeArray(filters.riskLevels),
  eventTypes: normalizeArray(filters.eventTypes),
  keywords: normalizeArray(filters.keywords)
});

const buildEventQuery = (filters = {}, sinceDate = null) => {
  const query = {};

  if (filters.countries?.length) {
    query.country = { $in: filters.countries };
  }

  if (filters.domains?.length) {
    query.domains = { $in: filters.domains };
  }

  if (filters.riskLevels?.length) {
    query['summary.riskLevel'] = { $in: filters.riskLevels };
  }

  if (filters.eventTypes?.length) {
    query.eventType = { $in: filters.eventTypes };
  }

  if (filters.keywords?.length) {
    const keywordRegex = filters.keywords
      .filter(Boolean)
      .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    if (keywordRegex) {
      query.$or = [
        { title: { $regex: keywordRegex, $options: 'i' } },
        { description: { $regex: keywordRegex, $options: 'i' } }
      ];
    }
  }

  if (sinceDate) {
    query.createdAt = { $gt: sinceDate };
  }

  return query;
};

const computeMatchedFields = (event, filters) => {
  const matchedBy = {
    countries: [],
    domains: [],
    riskLevels: [],
    eventTypes: [],
    keywords: []
  };

  if (filters.countries?.includes(event.country)) {
    matchedBy.countries.push(event.country);
  }

  if (Array.isArray(event.domains) && filters.domains?.length) {
    matchedBy.domains = event.domains.filter(domain => filters.domains.includes(domain));
  }

  if (filters.riskLevels?.includes(event.summary?.riskLevel)) {
    matchedBy.riskLevels.push(event.summary?.riskLevel);
  }

  if (filters.eventTypes?.includes(event.eventType)) {
    matchedBy.eventTypes.push(event.eventType);
  }

  if (filters.keywords?.length) {
    const haystack = `${event.title || ''} ${event.description || ''}`.toLowerCase();
    matchedBy.keywords = filters.keywords.filter(keyword => haystack.includes(keyword.toLowerCase()));
  }

  return matchedBy;
};

const createAlertFromMatch = async (watchlist, event) => {
  const matchedBy = computeMatchedFields(event, watchlist.filters || {});

  const alert = await Alert.findOneAndUpdate(
    {
      watchlistId: watchlist._id,
      eventId: event._id
    },
    {
      userId: watchlist.userId || DEMO_USER_ID,
      watchlistId: watchlist._id,
      eventId: event._id,
      title: `Watchlist hit: ${watchlist.name}`,
      message: `${event.title} matched your watchlist filters.`,
      matchedBy,
      deliveredAt: new Date()
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  return alert;
};

const sweepWatchlist = async (watchlist) => {
  const sinceDate = watchlist.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000);
  const eventQuery = buildEventQuery(watchlist.filters, sinceDate);
  const matchedEvents = await Event.find(eventQuery).sort({ createdAt: -1 }).limit(50);

  for (const event of matchedEvents) {
    await createAlertFromMatch(watchlist, event);
  }

  watchlist.lastNotifiedAt = new Date();
  await watchlist.save();

  return matchedEvents.length;
};

const runAlertSweep = async () => {
  const watchlists = await Watchlist.find({});
  let totalMatches = 0;

  for (const watchlist of watchlists) {
    totalMatches += await sweepWatchlist(watchlist);
  }

  return { watchlistsProcessed: watchlists.length, totalMatches };
};

const runAlertSweepForEvent = async (event) => {
  const watchlists = await Watchlist.find({});
  let created = 0;

  for (const watchlist of watchlists) {
    const query = buildEventQuery(watchlist.filters || {});
    const matchesEvent = await Event.exists({ _id: event._id, ...query });

    if (matchesEvent) {
      await createAlertFromMatch(watchlist, event);
      watchlist.lastNotifiedAt = new Date();
      await watchlist.save();
      created += 1;
    }
  }

  return created;
};

const getWatchlistPreviewEvents = async (watchlist, limit = 20) => {
  const query = buildEventQuery(watchlist.filters || {});
  return Event.find(query).sort({ createdAt: -1 }).limit(limit);
};

module.exports = {
  DEMO_USER_ID,
  normalizeFilters,
  buildEventQuery,
  runAlertSweep,
  runAlertSweepForEvent,
  getWatchlistPreviewEvents
};
