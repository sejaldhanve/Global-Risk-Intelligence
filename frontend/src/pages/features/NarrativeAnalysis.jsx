import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import NarrativeRealityPanel from '../../components/dashboard/NarrativeRealityPanel'
import EventCard from '../../components/dashboard/EventCard'
import { useEvents } from '../../hooks/useEvents'

const insightBlocks = [
  {
    title: 'Alignment score',
    body: 'A live percentage that shows how many narratives match on-the-ground indicators. When it drops, analysts know to challenge assumptions.'
  },
  {
    title: 'Reality cross-check',
    body: 'Each narrative is matched against satellite, trade, and logistics telemetry so misinformation is quarantined before it cascades.'
  },
  {
    title: 'Escalation cues',
    body: 'Uncertain narratives in critical-risk regions trigger validation workflows so an analyst can confirm or dismiss within minutes.'
  }
]

export default function NarrativeAnalysis() {
  const { events, loading, error } = useEvents({ limit: 30 })

  const aligned = events.filter((event) => event.narrativeAnalysis?.isReal === 'real')
  const disputed = events.filter((event) => event.narrativeAnalysis?.isReal === 'fake')
  const needsReview = events.filter((event) => event.narrativeAnalysis?.isReal === 'uncertain')

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Narrative engine"
        title="Narrative vs Reality Detection"
        subtitle="Stop misinformation loops by comparing what the world is saying with what actually shows up in telemetry, trade data, and field reports."
      />

      <div className="card">
        {loading && <div className="text-center py-10 text-gray-500">Checking narrative alignment…</div>}
        {error && <div className="border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>}
        {!loading && !error && <NarrativeRealityPanel events={events} />}
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        {insightBlocks.map((insight) => (
          <FeatureDescription key={insight.title} title={insight.title}>
            <p>{insight.body}</p>
          </FeatureDescription>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Aligned narratives</h3>
          <p className="text-sm text-gray-500">What the public says matches our system telemetry.</p>
          <div className="space-y-3">
            {aligned.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {aligned.length === 0 && <div className="card text-sm text-gray-500">No aligned narratives yet.</div>}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Disputed narratives</h3>
          <p className="text-sm text-gray-500">Claims flagged as false or exaggerated.</p>
          <div className="space-y-3">
            {disputed.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {disputed.length === 0 && <div className="card text-sm text-gray-500">No disputed narratives right now.</div>}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Signals needing validation</h3>
          <p className="text-sm text-gray-500">Auto-routed to analysts for rapid confirmation.</p>
          <div className="space-y-3">
            {needsReview.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {needsReview.length === 0 && <div className="card text-sm text-gray-500">All signals validated.</div>}
          </div>
        </div>
      </section>
    </div>
  )
}
