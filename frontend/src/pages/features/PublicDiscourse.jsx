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
    <div className="space-y-10 animate-fade-in">
      <div className="animate-slide-up">
        <FeatureHeader
          eyebrow="Sentiment engine"
          title="Public Discourse Intelligence"
          subtitle="Track Reddit and Twitter narratives, sentiment swings, and engagement spikes across whichever domain matters to today’s briefing."
        />
      </div>

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className="card animate-slide-in-right animation-delay-200">
          <p className="text-sm text-gray-400 mb-4">Toggle which feed powers the discourse model.</p>
          <DomainFilter selectedDomain={domain} onDomainChange={setDomain} />
        </div>
        <div className="card animate-slide-up animation-delay-300">
          <PublicDiscoursePanel domain={domain} />
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        {discourseInsights.map((insight, i) => (
          <div key={insight.title} className="animate-slide-up" style={{ animationDelay: `${(i * 100) + 400}ms` }}>
            <FeatureDescription title={insight.title}>
              <p>{insight.body}</p>
            </FeatureDescription>
          </div>
        ))}
      </section>

      <section className="space-y-4 animate-slide-up animation-delay-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Narrative-linked events</h2>
            <p className="text-sm text-gray-400">Events automatically tagged to <span className="text-[#fca311]">{domain.replace('_', ' ')}</span> discourse streams.</p>
          </div>
        </div>

        {loading && <div className="card text-center py-10 text-gray-500 animate-pulse">Loading discourse-linked events…</div>}
        {error && <div className="card border border-red-200 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.slice(0, 6).map((event, index) => (
              <div key={event._id} className="transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                <EventCard event={event} />
              </div>
            ))}
            {events.length === 0 && <div className="card text-center py-10 text-gray-500 col-span-2">No aligned events yet.</div>}
          </div>
        )}
      </section>
    </div>
  )
}
