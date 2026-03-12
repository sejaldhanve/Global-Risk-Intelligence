import { useMemo, useState } from 'react'
import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import DomainFilter from '../../components/dashboard/DomainFilter'
import PublicDiscoursePanel from '../../components/dashboard/PublicDiscoursePanel'
import EventCard from '../../components/dashboard/EventCard'
import { useEvents } from '../../hooks/useEvents'

const discourseInsights = [
  {
    title: 'Narrative spike detection',
    body: 'We monitor subreddit clusters, X/Twitter lists, and regional forums. When engagement crosses baselines, analysts get pinged with context.'
  },
  {
    title: 'Sentiment trajectory',
    body: 'Distribution chips show whether optimism, concern, or panic dominates. Rapid swings often precede policy action or protests.'
  },
  {
    title: 'Source credibility',
    body: 'Signals are traced back to their originating communities so you can weigh verified journalists differently than anonymous accounts.'
  }
]

export default function PublicDiscourseFeature() {
  const [domain, setDomain] = useState('public_discourse')
  const eventParams = useMemo(
    () => (domain === 'all' ? { limit: 12 } : { domain, limit: 12, autoPopulate: true }),
    [domain]
  )
  const { events, loading, error } = useEvents(eventParams)

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Sentiment engine"
        title="Public Discourse Intelligence"
        subtitle="Track Reddit and Twitter narratives, sentiment swings, and engagement spikes across whichever domain matters to today’s briefing."
      />

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-4">Toggle which feed powers the discourse model.</p>
          <DomainFilter selectedDomain={domain} onDomainChange={setDomain} />
        </div>
        <div className="card">
          <PublicDiscoursePanel domain={domain} />
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        {discourseInsights.map((insight) => (
          <FeatureDescription key={insight.title} title={insight.title}>
            <p>{insight.body}</p>
          </FeatureDescription>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Narrative-linked events</h2>
            <p className="text-sm text-gray-500">Events automatically tagged to {domain.replace('_', ' ')} discourse streams.</p>
          </div>
        </div>

        {loading && <div className="card text-center py-10 text-gray-500">Loading discourse-linked events…</div>}
        {error && <div className="card border border-red-200 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {events.length === 0 && <div className="card text-center py-10 text-gray-500">No aligned events yet.</div>}
          </div>
        )}
      </section>
    </div>
  )
}
