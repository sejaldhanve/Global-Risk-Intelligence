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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="card text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Event not found</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const riskColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300'
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{event.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${riskColors[event.summary?.riskLevel || 'medium']}`}>
            {(event.summary?.riskLevel || 'medium').toUpperCase()} RISK
          </span>
        </div>

        <div className="flex items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{event.country}, {event.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{event.eventType?.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">AI Consensus Summary</h2>
          <p className="text-gray-700 mb-4">{event.summary?.text}</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Confidence Level</span>
                <span>{event.summary?.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${event.summary?.confidence}%` }}
                />
              </div>
            </div>

            {event.narrativeAnalysis && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Narrative Verification</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.narrativeAnalysis.isReal === 'real' ? 'bg-green-100 text-green-800' :
                    event.narrativeAnalysis.isReal === 'fake' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.narrativeAnalysis.isReal?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Sentiment: {event.narrativeAnalysis.sentiment}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
          
          {event.impact && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Affected Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.sectors?.map((sector, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Commodities at Risk</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.commodities?.map((commodity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {commodity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Affected Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {event.impact.affectedCountries?.map((country, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Severity</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColors[event.impact.severity || 'medium']}`}>
                    {(event.impact.severity || 'medium').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {forecasts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Price Forecasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map((forecast, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {forecast.commodity}
                </h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {forecast.prediction}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">{forecast.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeframe:</span>
                    <span className="font-medium">{forecast.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend:</span>
                    <span className={`font-medium ${
                      forecast.data?.trend === 'increase' ? 'text-red-600' : 'text-green-600'
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

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <ConflictMap events={[event]} />
      </div>

      {event.sources && event.sources.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Sources ({event.sources.length})</h2>
          <div className="space-y-3">
            {event.sources.slice(0, 10).map((source, idx) => (
              <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  {source.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Credibility: {source.credibility}%</span>
                  <span>Rank: #{source.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
