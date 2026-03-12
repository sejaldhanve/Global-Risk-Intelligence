import { MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const riskColors = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300'
}

export default function EventCard({ event }) {
  const riskLevel = event.summary?.riskLevel || 'medium'
  
  return (
    <Link to={`/event/${event._id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {event.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${riskColors[riskLevel]}`}>
            {riskLevel.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{event.country}, {event.region}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {event.summary?.confidence && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Confidence</span>
              <span>{event.summary.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${event.summary.confidence}%` }}
              />
            </div>
          </div>
        )}

        {event.impact?.sectors && event.impact.sectors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.impact.sectors.slice(0, 3).map((sector, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {sector}
              </span>
            ))}
            {event.impact.sectors.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{event.impact.sectors.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
