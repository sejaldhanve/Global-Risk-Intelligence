import { useMemo } from 'react'
import EventCard from '../../components/dashboard/EventCard'
import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import { useEvents } from '../../hooks/useEvents'

const impactSections = [
  {
    key: 'energy',
    title: 'Energy Supply Disruptions',
    body: 'Track refinery outages, pipeline pressure drops, and power-grid anomalies to understand when energy supplies are stressed and where secondary markets may feel the pinch.'
  },
  {
    key: 'trade',
    title: 'Trade Route Disruptions',
    body: 'Detect choke points across maritime corridors, rail hubs, and inland crossings before bottlenecks ripple through manufacturing and retail.'
  },
  {
    key: 'commodity',
    title: 'Commodity Price Volatility',
    body: 'Surface events linked to strategic commodities—from grains to critical minerals—to anticipate price swings and hedging opportunities.'
  },
  {
    key: 'logistics',
    title: 'Logistics Network Disruptions',
    body: 'Monitor warehouse capacity, trucking availability, and cross-border clearance delays to keep fulfillment timelines honest.'
  }
]

const keywordMatchers = {
  energy: /energy|oil|gas|fuel|pipeline|power|grid|refinery/i,
  trade: /trade|shipping|strait|canal|port|suez|panama|route/i,
  commodity: /commodity|grain|wheat|metal|lithium|copper|corn|soy|nickel/i,
  logistics: /logistics|supply|warehouse|trucking|rail|freight|distribution|fulfillment/i
}

function bucketEventsByImpact(events = []) {
  const buckets = {
    energy: [],
    trade: [],
    commodity: [],
    logistics: []
  }

  events.forEach((event) => {
    const impactText = [
      ...(event.impact?.sectors || []),
      ...(event.impact?.commodities || []),
      ...(event.impact?.tradeRoutes || [])
    ].join(' ')

    Object.entries(keywordMatchers).forEach(([key, regex]) => {
      if (regex.test(impactText) || regex.test(event.description || '')) {
        buckets[key].push(event)
      }
    })
  })

  return buckets
}

export default function SystemImpact() {
  const { events, loading, error } = useEvents({ limit: 40 })
  const impactBuckets = useMemo(() => bucketEventsByImpact(events), [events])

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Systemic analysis"
        title="Systemic Impact Analysis"
        subtitle="Explain how seemingly local flashpoints cascade into energy shortages, blocked trade lanes, commodity volatility, and logistics slowdowns."
      />

      {loading && <div className="card text-center py-10 text-gray-500">Modeling cascading impacts…</div>}
      {error && <div className="card border border-red-200 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {impactSections.map((section) => (
            <div key={section.key} className="grid lg:grid-cols-[320px,1fr] gap-6">
              <FeatureDescription title={section.title}>
                <p>{section.body}</p>
                <p className="text-xs text-gray-500">Tied events: {impactBuckets[section.key].length || 0}</p>
              </FeatureDescription>

              <div className="grid md:grid-cols-2 gap-4">
                {impactBuckets[section.key].length === 0 && (
                  <div className="card text-sm text-gray-500">No tagged events yet—feed will populate as data streams arrive.</div>
                )}
                {impactBuckets[section.key].slice(0, 4).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
