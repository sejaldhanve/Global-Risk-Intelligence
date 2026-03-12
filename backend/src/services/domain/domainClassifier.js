const classifySourceDomain = (source) => {
  const url = source.url?.toLowerCase() || '';
  const title = source.title?.toLowerCase() || '';
  const snippet = source.snippet?.toLowerCase() || '';
  const content = `${title} ${snippet}`;

  // Verified news domains
  const newsDomains = [
    'reuters.com', 'apnews.com', 'bbc.com', 'cnn.com', 'nytimes.com',
    'wsj.com', 'ft.com', 'bloomberg.com', 'theguardian.com', 'aljazeera.com'
  ];

  // Economic indicators keywords
  const economicKeywords = [
    'gdp', 'inflation', 'market', 'stock', 'economy', 'economic',
    'trade balance', 'unemployment', 'interest rate', 'central bank',
    'imf', 'world bank', 'economic data', 'financial'
  ];

  // Shipping activity keywords
  const shippingKeywords = [
    'shipping', 'maritime', 'port', 'vessel', 'cargo', 'freight',
    'container', 'tanker', 'suez', 'panama canal', 'strait', 'sea route'
  ];

  // Energy supply keywords
  const energyKeywords = [
    'oil', 'gas', 'energy', 'petroleum', 'opec', 'pipeline',
    'crude', 'natural gas', 'lng', 'refinery', 'energy supply',
    'power grid', 'electricity', 'renewable'
  ];

  // Logistics keywords
  const logisticsKeywords = [
    'logistics', 'supply chain', 'warehouse', 'distribution',
    'transportation', 'delivery', 'inventory', 'procurement'
  ];

  // Public discourse keywords
  const discourseKeywords = [
    'twitter', 'reddit', 'social media', 'public opinion', 'sentiment',
    'discourse', 'narrative', 'trending', 'viral', 'discussion'
  ];

  // Check for verified news
  if (newsDomains.some(domain => url.includes(domain))) {
    return 'verified_news';
  }

  // Check content for domain classification
  if (economicKeywords.some(keyword => content.includes(keyword))) {
    return 'economic_indicators';
  }

  if (shippingKeywords.some(keyword => content.includes(keyword))) {
    return 'shipping_activity';
  }

  if (energyKeywords.some(keyword => content.includes(keyword))) {
    return 'energy_supply';
  }

  if (logisticsKeywords.some(keyword => content.includes(keyword))) {
    return 'logistics_networks';
  }

  if (discourseKeywords.some(keyword => content.includes(keyword))) {
    return 'public_discourse';
  }

  return 'other';
};

const classifyEventDomains = (sources) => {
  const domainSet = new Set();
  
  sources.forEach(source => {
    const domain = classifySourceDomain(source);
    if (domain !== 'other') {
      domainSet.add(domain);
    }
  });

  return Array.from(domainSet);
};

module.exports = {
  classifySourceDomain,
  classifyEventDomains
};
