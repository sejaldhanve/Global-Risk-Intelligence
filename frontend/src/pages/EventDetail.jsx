import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react'
import axios from 'axios'
import ConflictMap from '../components/maps/ConflictMap'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [forecasts, setForecasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetail()
  }, [id])

  const fetchEventDetail = async () => {
    try {
      const response = await axios.get(`/api/event/${id}`)
      setEvent(response.data.event)
      setForecasts(response.data.forecasts || [])
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-gray-500 animate-pulse">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="card text-center py-12 animate-fade-in">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Event not found</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const riskColors = {
    critical: 'bg-red-100/10 text-red-500 border-red-500/20',
    high: 'bg-orange-100/10 text-orange-500 border-orange-500/20',
    medium: 'bg-yellow-100/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-green-100/10 text-green-500 border-green-500/20'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-[#fca311] hover:text-[#ffd166] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="card animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-100 flex-1">{event.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${riskColors[event.summary?.riskLevel || 'medium']}`}>
            {(event.summary?.riskLevel || 'medium').toUpperCase()} RISK
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#fca311]" />
            <span>{event.country}, {event.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#fca311]" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#fca311]" />
            <span>{event.eventType?.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-slide-up animation-delay-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">AI Consensus Summary</h2>
          <p className="text-gray-300 mb-4">{event.summary?.text}</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Confidence Level</span>
                <span className="text-[#fca311] font-bold">{event.summary?.confidence}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#fca311] to-[#ffd166] h-2 rounded-full"
                  style={{ width: `${event.summary?.confidence}%` }}
                />
              </div>
            </div>

            {event.narrativeAnalysis && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Narrative Verification</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    event.narrativeAnalysis.isReal === 'real' ? 'bg-green-100/10 text-green-500 border-green-500/20' :
                    event.narrativeAnalysis.isReal === 'fake' ? 'bg-red-100/10 text-red-500 border-red-500/20' :
                    'bg-yellow-100/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {event.narrativeAnalysis.isReal?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="text-gray-500">Sentiment:</span> {event.narrativeAnalysis.sentiment}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card animate-slide-up animation-delay-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Impact Analysis</h2>
          
          {event.impact && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Affected Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.sectors?.map((sector, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-full text-sm">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Commodities at Risk</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.commodities?.map((commodity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#fca311]/10 text-[#ffd166] border border-[#fca311]/20 rounded-full text-sm">
                      {commodity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Affected Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.affectedCountries?.map((country, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-full text-sm">
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-400">Severity</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${riskColors[event.impact.severity || 'medium']}`}>
                    {(event.impact.severity || 'medium').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {forecasts.length > 0 && (
        <div className="card animate-slide-up animation-delay-300">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-100">
            <TrendingUp className="h-6 w-6 text-[#fca311]" />
            Price Forecasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map((forecast, idx) => (
              <div key={idx} className="border border-white/10 bg-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                <h3 className="font-semibold text-gray-200 mb-2 capitalize">
                  {forecast.commodity}
                </h3>
                <div className="text-3xl font-bold text-[#ffd166] mb-2">
                  {forecast.prediction}
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium text-gray-200">{forecast.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeframe:</span>
                    <span className="font-medium text-gray-200">{forecast.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend:</span>
                    <span className={`font-medium ${
                      forecast.data?.trend === 'increase' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {forecast.data?.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card animate-slide-up animation-delay-400">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Location</h2>
        <div className="rounded-lg overflow-hidden border border-white/10">
          <ConflictMap events={[event]} />
        </div>
      </div>

      {event.sources && event.sources.length > 0 && (
        <div className="card animate-slide-up animation-delay-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Sources ({event.sources.length})</h2>
          <div className="space-y-3">
            {event.sources.slice(0, 10).map((source, idx) => (
              <div key={idx} className="border-l-4 border-[#fca311] pl-4 py-2 bg-white/5 rounded-r-lg">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fca311] hover:text-[#ffd166] font-medium flex items-center gap-2 transition-colors"
                >
                  {source.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-gray-400 mt-2">{source.snippet}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="bg-white/5 px-2 py-1 rounded">Credibility: <span className="text-gray-300">{source.credibility}%</span></span>
                  <span className="bg-white/5 px-2 py-1 rounded">Rank: <span className="text-gray-300">#{source.rank}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
