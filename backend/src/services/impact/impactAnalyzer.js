class ImpactAnalyzer {
  constructor() {
    this.impactRules = {
      war: {
        sectors: ['military', 'energy', 'trade', 'humanitarian'],
        commodities: ['oil', 'gas', 'wheat', 'metals'],
        tradeRoutes: ['shipping', 'pipelines', 'land_routes']
      },
      sanction: {
        sectors: ['trade', 'finance', 'technology', 'energy'],
        commodities: ['oil', 'gas', 'technology', 'luxury_goods'],
        tradeRoutes: ['banking', 'swift', 'trade_corridors']
      },
      attack: {
        sectors: ['security', 'shipping', 'infrastructure', 'tourism'],
        commodities: ['oil', 'shipping_insurance', 'commodities'],
        tradeRoutes: ['shipping_lanes', 'air_routes', 'critical_infrastructure']
      },
      trade_dispute: {
        sectors: ['trade', 'manufacturing', 'agriculture', 'technology'],
        commodities: ['manufactured_goods', 'agricultural_products', 'raw_materials'],
        tradeRoutes: ['trade_agreements', 'tariffs', 'quotas']
      },
      natural_disaster: {
        sectors: ['infrastructure', 'agriculture', 'energy', 'humanitarian'],
        commodities: ['food', 'water', 'energy', 'construction_materials'],
        tradeRoutes: ['supply_chains', 'transportation', 'logistics']
      },
      political_crisis: {
        sectors: ['governance', 'economy', 'social', 'security'],
        commodities: ['currency', 'investments', 'bonds'],
        tradeRoutes: ['capital_flows', 'investment', 'migration']
      }
    };

    this.regionalImpacts = {
      'Middle East': {
        criticalCommodities: ['oil', 'gas', 'petrochemicals'],
        tradeRoutes: ['Suez Canal', 'Strait of Hormuz', 'Bab el-Mandeb'],
        globalImpact: 'high'
      },
      'Eastern Europe': {
        criticalCommodities: ['gas', 'wheat', 'fertilizer', 'metals'],
        tradeRoutes: ['Nord Stream', 'Ukrainian grain corridor', 'Black Sea'],
        globalImpact: 'high'
      },
      'East Asia': {
        criticalCommodities: ['electronics', 'semiconductors', 'manufacturing'],
        tradeRoutes: ['South China Sea', 'Taiwan Strait', 'Malacca Strait'],
        globalImpact: 'critical'
      },
      'South Asia': {
        criticalCommodities: ['textiles', 'pharmaceuticals', 'IT services'],
        tradeRoutes: ['Indian Ocean', 'land routes'],
        globalImpact: 'medium'
      }
    };
  }

  analyzeImpact(eventData) {
    const eventType = eventData.eventType || 'other';
    const country = eventData.country || '';
    const region = this.determineRegion(country);

    const baseImpact = this.impactRules[eventType] || this.impactRules.other || {
      sectors: ['general'],
      commodities: ['various'],
      tradeRoutes: ['general']
    };

    const regionalModifier = this.regionalImpacts[region] || { globalImpact: 'low' };

    const severity = this.calculateSeverity(eventData, regionalModifier);

    const affectedCountries = this.identifyAffectedCountries(eventData, region);

    const impact = {
      sectors: [...new Set([...baseImpact.sectors, ...(eventData.sectors || [])])],
      commodities: [...new Set([
        ...baseImpact.commodities,
        ...(regionalModifier.criticalCommodities || []),
        ...(eventData.commodities || [])
      ])],
      tradeRoutes: [...new Set([
        ...baseImpact.tradeRoutes,
        ...(regionalModifier.tradeRoutes || [])
      ])],
      severity,
      affectedCountries,
      globalImpact: regionalModifier.globalImpact,
      economicImpact: this.assessEconomicImpact(severity, regionalModifier.globalImpact),
      timeframe: this.estimateTimeframe(eventType, severity)
    };

    return impact;
  }

  determineRegion(country) {
    const regionMap = {
      'Middle East': ['Iran', 'Iraq', 'Syria', 'Yemen', 'Saudi Arabia', 'UAE', 'Israel', 'Palestine', 'Lebanon', 'Jordan'],
      'Eastern Europe': ['Ukraine', 'Russia', 'Belarus', 'Poland', 'Moldova', 'Romania'],
      'East Asia': ['China', 'Taiwan', 'Japan', 'South Korea', 'North Korea'],
      'South Asia': ['India', 'Pakistan', 'Bangladesh', 'Afghanistan', 'Sri Lanka'],
      'Southeast Asia': ['Vietnam', 'Philippines', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand'],
      'Africa': ['Nigeria', 'South Africa', 'Egypt', 'Ethiopia', 'Kenya', 'Sudan'],
      'Latin America': ['Brazil', 'Mexico', 'Argentina', 'Venezuela', 'Colombia']
    };

    for (const [region, countries] of Object.entries(regionMap)) {
      if (countries.some(c => country.toLowerCase().includes(c.toLowerCase()))) {
        return region;
      }
    }

    return 'Other';
  }

  calculateSeverity(eventData, regionalModifier) {
    let severityScore = 0;

    const riskMap = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };

    severityScore += riskMap[eventData.risk] || 1;

    const globalImpactMap = {
      'critical': 3,
      'high': 2,
      'medium': 1,
      'low': 0
    };

    severityScore += globalImpactMap[regionalModifier.globalImpact] || 0;

    if (severityScore >= 6) return 'critical';
    if (severityScore >= 4) return 'high';
    if (severityScore >= 2) return 'medium';
    return 'low';
  }

  identifyAffectedCountries(eventData, region) {
    const affected = new Set();

    if (eventData.country) {
      affected.add(eventData.country);
    }

    if (eventData.affectedCountries) {
      eventData.affectedCountries.forEach(c => affected.add(c));
    }

    const neighbors = this.getNeighboringCountries(eventData.country);
    neighbors.forEach(c => affected.add(c));

    return Array.from(affected);
  }

  getNeighboringCountries(country) {
    const neighborMap = {
      'Ukraine': ['Russia', 'Poland', 'Romania', 'Moldova', 'Belarus'],
      'Russia': ['Ukraine', 'Belarus', 'China', 'Kazakhstan', 'Finland', 'Norway'],
      'Iran': ['Iraq', 'Turkey', 'Afghanistan', 'Pakistan', 'Azerbaijan'],
      'Israel': ['Palestine', 'Lebanon', 'Syria', 'Jordan', 'Egypt'],
      'China': ['Russia', 'India', 'Pakistan', 'Afghanistan', 'North Korea', 'Vietnam'],
      'Taiwan': ['China', 'Japan', 'Philippines']
    };

    return neighborMap[country] || [];
  }

  assessEconomicImpact(severity, globalImpact) {
    const severityMultiplier = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };

    const globalMultiplier = {
      'critical': 3,
      'high': 2,
      'medium': 1.5,
      'low': 1
    };

    const score = (severityMultiplier[severity] || 1) * (globalMultiplier[globalImpact] || 1);

    if (score >= 10) return 'catastrophic';
    if (score >= 6) return 'severe';
    if (score >= 3) return 'moderate';
    return 'minimal';
  }

  estimateTimeframe(eventType, severity) {
    const timeframes = {
      war: severity === 'critical' ? 'months to years' : 'weeks to months',
      sanction: 'months to years',
      attack: severity === 'critical' ? 'weeks to months' : 'days to weeks',
      trade_dispute: 'months',
      natural_disaster: 'weeks to months',
      political_crisis: 'weeks to months'
    };

    return timeframes[eventType] || 'uncertain';
  }
}

module.exports = new ImpactAnalyzer();
