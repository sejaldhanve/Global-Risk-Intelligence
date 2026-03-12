import { useMemo } from 'react'
import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import RiskChart from '../../components/dashboard/RiskChart'
import { RiskForecastPanel } from '../../components/dashboard/RiskForecastPanel'
import EventCard from '../../components/dashboard/EventCard'
import { useEvents } from '../../hooks/useEvents'

const modelInsights = [
  {
    title: 'Hybrid signals',
    body: 'We blend structured indicators (macro, logistics, energy telemetry) with unstructured intel to feed the forecast bands.'
  },
  {
    title: 'Confidence windows',
    body: 'Each forecast carries a confidence envelope so ops leaders know when to escalate to a human analyst.'
  },
  {
    title: 'What-if stress tests',
    body: 'Run scenario analysis across commodity baskets or trade corridors to see how sensitive the curve is to new events.'
  }
]

export default function RiskForecast() {
  const { events, loading, error } = useEvents({ limit: 40 })
  const highRiskEvents = useMemo(
    () => events.filter((event) => ['high', 'critical'].includes(event.summary?.riskLevel)).slice(0, 4),
    [events]
  )

  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Predictive module"
        title="Geopolitical Risk Forecasting"
        subtitle="See where the risk curve is bending before headlines catch up—our models fuse live telemetry, domain classifiers, and narrative checks."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Risk Distribution</h2>
          <RiskChart events={events} />
        </div>
        <div className="card p-0 overflow-hidden">
          <RiskForecastPanel />
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        {modelInsights.map((insight) => (
          <FeatureDescription key={insight.title} title={insight.title}>
            <p>{insight.body}</p>
          </FeatureDescription>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">High-risk events on watch</h2>
            <p className="text-sm text-gray-500">Ranked by criticality and confidence</p>
          </div>
        </div>

        {loading && <div className="card text-center py-10 text-gray-500">Crunching live risk data…</div>}
        {error && <div className="card border border-red-200 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {highRiskEvents.length === 0 && (
              <div className="card text-center py-8 text-gray-500">No critical alerts yet—check back soon.</div>
            )}
            {highRiskEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
