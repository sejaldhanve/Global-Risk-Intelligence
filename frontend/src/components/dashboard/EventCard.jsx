import { MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const riskColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
}

export default function EventCard({ event }) {
  const riskLevel = event.summary?.riskLevel || 'medium'
  
  return (
    <Link to={`/event/${event._id}`}>
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 hover:border-[#fca311]/50 hover:shadow-[0_0_20px_rgba(252,163,17,0.15)] transition-all cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
          <h3 className="text-lg font-bold text-white flex-1 leading-snug">
            {event.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskColors[riskLevel]} self-start`}>
            {riskLevel.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 mb-4 bg-black/20 p-2 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#fca311]" />
            <span>{event.country}, {event.region}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#fca311]" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {event.summary?.confidence && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              <span>Confidence</span>
              <span className="text-[#fca311]">{event.summary.confidence}%</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#fca311] to-[#ffd166] h-1.5 rounded-full shadow-[0_0_10px_rgba(252,163,17,0.5)]"
                style={{ width: `${event.summary.confidence}%` }}
              />
            </div>
          </div>
        )}

        {event.impact?.sectors && event.impact.sectors.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {event.impact.sectors.slice(0, 3).map((sector, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded text-[10px] font-semibold uppercase tracking-wider"
              >
                {sector}
              </span>
            ))}
            {event.impact.sectors.length > 3 && (
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded text-[10px] font-semibold uppercase tracking-wider">
                +{event.impact.sectors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

