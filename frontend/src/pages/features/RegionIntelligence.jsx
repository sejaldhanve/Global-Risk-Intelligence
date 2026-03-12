import ConflictMap from '../../components/maps/ConflictMap'
import EventCard from '../../components/dashboard/EventCard'
import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import { useEvents } from '../../hooks/useEvents'

const clusterInsights = [
  {
    title: 'Cluster detection',
    body: 'We layer map telemetry with risk scoring so overlapping markers instantly reveal escalation clusters and spillover probability.'
  },
  {
    title: 'Regional saturation',
    body: 'Density thresholds show which corridors are saturated with incidents, helping triage analyst attention to the hottest theaters.'
  },
  {
    title: 'Impact radius',
    body: 'Each polygon illustrates an impact envelope that accounts for historical blast radius, supply chain exposure, and allied proximity.'
  }
]

export default function RegionIntelligence() {
  const { events, loading, error } = useEvents({ limit: 30 })

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Region module"
        title="Region-Based Conflict Intelligence"
        subtitle="Automatically surface conflict clusters, watch escalation corridors, and brief stakeholders on where the next flashpoint is brewing."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <ConflictMap events={events} />
        </div>
        <div className="space-y-4">
          {clusterInsights.map((item) => (
            <FeatureDescription key={item.title} title={item.title}>
              <p>{item.body}</p>
            </FeatureDescription>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent conflict signals</h2>
            <p className="text-sm text-gray-500">Live feed sourced from aggregated OSINT + analyst submissions</p>
          </div>
        </div>

        {loading && <div className="card text-center py-10 text-gray-500">Loading regional telemetry…</div>}
        {error && <div className="card border border-red-200 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {events.length === 0 && (
              <div className="card text-center py-10 text-gray-500">No signals yet for this domain.</div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
