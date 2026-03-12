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
    <div className="space-y-10 animate-fade-in">
      <div className="animate-slide-up">
        <FeatureHeader
          eyebrow="Region module"
          title="Region-Based Conflict Intelligence"
          subtitle="Automatically surface conflict clusters, watch escalation corridors, and brief stakeholders on where the next flashpoint is brewing."
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-0 overflow-hidden animate-slide-in-right animation-delay-200">
          <ConflictMap events={events} />
        </div>
        <div className="space-y-4">
          {clusterInsights.map((item, i) => (
            <div key={item.title} className="animate-slide-up" style={{ animationDelay: `${(i * 100) + 300}ms` }}>
              <FeatureDescription title={item.title}>
                <p>{item.body}</p>
              </FeatureDescription>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-4 animate-slide-up animation-delay-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent conflict signals</h2>
            <p className="text-sm text-gray-500">Live feed sourced from aggregated OSINT + analyst submissions</p>
          </div>
        </div>

        {loading && <div className="card text-center py-10 text-gray-500 animate-pulse">Loading regional telemetry…</div>}
        {error && <div className="card border border-red-200 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.slice(0, 6).map((event, index) => (
              <div key={event._id} className="animate-slide-up transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: `${(index % 6) * 100 + 100}ms` }}>
                <EventCard event={event} />
              </div>
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
