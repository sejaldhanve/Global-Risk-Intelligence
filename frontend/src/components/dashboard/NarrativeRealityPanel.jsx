import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react'

const classificationStyles = {
  real: {
    label: 'Aligned',
    description: 'Narratives confirmed by on-ground signals',
    chip: 'bg-emerald-50 text-emerald-700',
    accent: 'border-emerald-100 bg-emerald-50/60'
  },
  fake: {
    label: 'Disputed',
    description: 'Narratives flagged as misinformation or exaggerated',
    chip: 'bg-rose-50 text-rose-700',
    accent: 'border-rose-100 bg-rose-50/60'
  },
  uncertain: {
    label: 'Needs Review',
    description: 'Signals that require analyst validation',
    chip: 'bg-amber-50 text-amber-700',
    accent: 'border-amber-100 bg-amber-50/60'
  }
}

const riskColors = {
  critical: 'text-rose-600 bg-rose-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-emerald-600 bg-emerald-50'
}

export default function NarrativeRealityPanel({ events = [] }) {
  const analyzedEvents = events.filter(
    (event) => event?.narrativeAnalysis?.isReal && event?.summary?.riskLevel
  )

  const counts = analyzedEvents.reduce(
    (acc, event) => {
      const key = event.narrativeAnalysis.isReal
      if (acc[key] !== undefined) {
        acc[key] += 1
      }
      return acc
    },
    { real: 0, fake: 0, uncertain: 0 }
  )

  const totalAnalyzed = analyzedEvents.length
  const alignmentScore = totalAnalyzed ? Math.round((counts.real / totalAnalyzed) * 100) : 0

  const flaggedEvents = analyzedEvents
    .filter(
      (event) =>
        event.narrativeAnalysis.isReal !== 'real' ||
        (event.summary?.riskLevel === 'critical' && event.narrativeAnalysis.isReal === 'uncertain')
    )
    .slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Narrative vs Reality</h3>
          <p className="text-sm text-gray-500">
            {totalAnalyzed ? `${totalAnalyzed} events with verified narratives` : 'Waiting for analyzed events'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-400">Alignment Score</p>
          <p className="text-2xl font-bold text-gray-900">{alignmentScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {Object.entries(classificationStyles).map(([key, meta]) => (
          <div key={key} className={`rounded-xl border p-4 ${meta.accent}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
              <span className="text-lg font-bold text-gray-900">{counts[key]}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{meta.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-gray-800">Signals Requiring Validation</h4>
          </div>
          <p className="text-xs text-gray-500">Prioritized by risk impact</p>
        </div>

        {flaggedEvents.length === 0 ? (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-700 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            All current narratives align with system indicators.
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedEvents.map((event) => (
              <div
                key={event._id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      classificationStyles[event.narrativeAnalysis.isReal]?.chip || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {classificationStyles[event.narrativeAnalysis.isReal]?.label || 'Narrative' }
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {event.summary?.text || 'Analysis pending'}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold capitalize ${
                      riskColors[event.summary?.riskLevel] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {event.summary?.riskLevel || 'unknown'} risk
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Sentiment: {event.narrativeAnalysis?.sentiment || 'neutral'}
                  </span>
                  {typeof event.summary?.confidence === 'number' && (
                    <span className="flex items-center gap-1">
                      Confidence: {event.summary.confidence}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
