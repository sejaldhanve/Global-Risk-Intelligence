import { useMemo, useState } from 'react'
import DomainFilter from '../../components/dashboard/DomainFilter'
import EventCard from '../../components/dashboard/EventCard'
import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import { useEvents } from '../../hooks/useEvents'

const domainInsights = [
  {
    value: 'verified_news',
    title: 'Verified News',
    body: 'Fact-checked reporting from Reuters, AP, Bloomberg, and similar sources anchors the baseline reality before we blend in speculative chatter.'
  },
  {
    value: 'economic_indicators',
    title: 'Economic Indicators',
    body: 'Macro data—CPI spikes, PMI contractions, bond yields—quantifies downstream impact beyond tactical events.'
  },
  {
    value: 'shipping_activity',
    title: 'Shipping Activity',
    body: 'AIS feeds and port telemetry reveal chokepoints before trade flows stall, crucial for maritime corridors and insurers.'
  },
  {
    value: 'energy_supply',
    title: 'Energy Supply',
    body: 'Pipeline telemetry, refinery outages, and OPEC commentary inform global fuel stability assessments.'
  },
  {
    value: 'logistics_networks',
    title: 'Logistics Networks',
    body: 'Warehouse outages, trucking slowdowns, and rail strikes highlight cascading supply-chain friction.'
  },
  {
    value: 'public_discourse',
    title: 'Public Discourse',
    body: 'Open-source narratives explain perception gaps—vital for information ops and reputational risk teams.'
  }
]

export default function DomainFiltering() {
  const [domain, setDomain] = useState('verified_news')

  const params = useMemo(() => (
    domain === 'all'
      ? { limit: 12 }
      : { domain, limit: 12, autoPopulate: true }
  ), [domain])

  const { events, loading, error } = useEvents(params)

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Domain module"
        title="Domain-Based Intelligence Filtering"
        subtitle="Flip between intelligence domains to isolate signals coming from financial data, logistics telemetry, or public narratives without rebuilding dashboards."
      />

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-4">Select an intelligence stream to auto-populate relevant events.</p>
          <DomainFilter embedded selectedDomain={domain} onDomainChange={setDomain} />
        </div>
        <div className="space-y-4">
          {loading && <div className="card text-center py-10 text-gray-500">Fetching {domain.replace('_', ' ')} signals…</div>}
          {error && <div className="card border border-red-200 text-red-700">{error}</div>}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 gap-4">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
              {events.length === 0 && (
                <div className="card text-center py-10 text-gray-500">No events tagged for this domain yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {domainInsights.map((insight) => (
          <FeatureDescription key={insight.value} title={insight.title}>
            <p>{insight.body}</p>
          </FeatureDescription>
        ))}
      </section>
    </div>
  )
}
