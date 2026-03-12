import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react'

const classificationStyles = {
  real: {
    label: 'Aligned',
    description: 'Narratives confirmed by on-ground signals',
    chip: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    accent: 'border-emerald-500/30 bg-emerald-500/10'
  },
  fake: {
    label: 'Disputed',
    description: 'Narratives flagged as misinformation or exaggerated',
    chip: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    accent: 'border-rose-500/30 bg-rose-500/10'
  },
  uncertain: {
    label: 'Needs Review',
    description: 'Signals that require analyst validation',
    chip: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    accent: 'border-amber-500/30 bg-amber-500/10'
  }
}

const riskColors = {
  critical: 'text-red-400 bg-red-500/20',
  high: 'text-orange-400 bg-orange-500/20',
  medium: 'text-yellow-400 bg-yellow-500/20',
  low: 'text-emerald-400 bg-emerald-500/20'
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
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Narrative vs Reality</h3>
          <p className="text-sm text-gray-400">
            {totalAnalyzed ? `${totalAnalyzed} events with verified narratives` : 'Waiting for analyzed events'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Alignment Score</p>
          <p className="text-3xl font-bold text-[#fca311]">{alignmentScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {Object.entries(classificationStyles).map(([key, meta]) => (
          <div key={key} className={`rounded-xl border p-4 ${meta.accent} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-200 tracking-wide">{meta.label}</span>
              <span className="text-xl font-bold text-white">{counts[key]}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{meta.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#fca311]" />
            <h4 className="text-base font-semibold text-white">Signals Requiring Validation</h4>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Prioritized by risk impact</p>
        </div>

        {flaggedEvents.length === 0 ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">All current narratives align with system indicators.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedEvents.map((event) => (
              <div
                key={event._id}
                className="bg-black/20 border border-white/10 rounded-xl p-5 hover:border-[#fca311]/50 hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <p className="text-base font-bold text-white leading-snug">{event.title}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      classificationStyles[event.narrativeAnalysis.isReal]?.chip || 'bg-white/10 text-gray-300 border border-white/20'
                    } self-start`}
                  >
                    {classificationStyles[event.narrativeAnalysis.isReal]?.label || 'Narrative' }
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {event.summary?.text || 'Analysis pending'}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-gray-400">
                  <span
                    className={`px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      riskColors[event.summary?.riskLevel] || 'bg-white/10 text-gray-300 border border-white/20'
                    }`}
                  >
                    {event.summary?.riskLevel || 'unknown'} risk
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    <Activity className="h-3.5 w-3.5 text-[#fca311]" />
                    Sentiment: {event.narrativeAnalysis?.sentiment || 'neutral'}
                  </span>
                  {typeof event.summary?.confidence === 'number' && (
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <span className="text-[#fca311]">Conf:</span> {event.summary.confidence}%
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
