import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { MessageCircle, Activity, Radio } from 'lucide-react'

const DOMAIN_QUERIES = {
  verified_news: 'breaking verified geopolitical conflict updates',
  economic_indicators: 'geopolitical impact on economic indicators and markets',
  shipping_activity: 'global shipping disruptions due to conflict',
  energy_supply: 'energy supply risk from geopolitical tension',
  logistics_networks: 'supply chain disruption alerts',
  public_discourse: 'global sentiment about major conflicts'
}

const sentimentColors = {
  optimistic: 'text-emerald-600 bg-emerald-50',
  concerned: 'text-amber-600 bg-amber-50',
  negative: 'text-rose-600 bg-rose-50',
  mixed: 'text-slate-600 bg-slate-100'
}

export default function PublicDiscoursePanel({ domain }) {
  const [discourse, setDiscourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const query = useMemo(() => {
    if (domain && domain !== 'all') {
      return DOMAIN_QUERIES[domain] || 'global conflict public discourse'
    }
    return 'global conflict public discourse'
  }, [domain])

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true

    const fetchDiscourse = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.post(
          '/api/discourse/aggregate',
          { query, limit: 5 },
          { signal: controller.signal }
        )
        if (mounted) {
          setDiscourse(response.data)
        }
      } catch (err) {
        if (!axios.isCancel(err) && mounted) {
          setError(err.response?.data?.error || 'Unable to load discourse data')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDiscourse()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [query])

  const sentimentDistribution = useMemo(() => {
    if (!discourse?.aggregatedSentiment?.distribution) return []
    return Object.entries(discourse.aggregatedSentiment.distribution).map(([key, value]) => ({
      key,
      value
    }))
  }, [discourse])

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Public Discourse Signals</h3>
          <p className="text-sm text-gray-500">Live sentiment from open platforms</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MessageCircle className="h-4 w-4" />
          {domain === 'all' ? 'Global view' : domain.replace('_', ' ')}
        </div>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-500">Loading discourse...</div>
      ) : error ? (
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : !discourse ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-500">Awaiting discourse data</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Dominant Sentiment</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">
                {discourse.aggregatedSentiment?.dominant || 'mixed'}
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Audience Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {discourse.totalEngagement?.toLocaleString?.() || 0}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
              <Activity className="h-4 w-4 text-gray-500" /> Sentiment Distribution
            </div>
            {sentimentDistribution.length === 0 ? (
              <p className="text-sm text-gray-500">Not enough signals yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sentimentDistribution.map(({ key, value }) => (
                  <div
                    key={key}
                    className={`px-3 py-2 rounded-full text-xs font-semibold capitalize ${
                      sentimentColors[key] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {key}: {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
              <Radio className="h-4 w-4 text-gray-500" /> Leading Narratives
            </div>
            {discourse.discourse?.length ? (
              <div className="space-y-3">
                {discourse.discourse.map((item, idx) => (
                  <div
                    key={`${item.platform}-${idx}`}
                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 capitalize">{item.platform}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          sentimentColors[item.sentiment] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span>Engagement: {item.engagement?.toLocaleString?.() || 0}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 font-medium hover:underline"
                      >
                        View Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No public discourse items yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
