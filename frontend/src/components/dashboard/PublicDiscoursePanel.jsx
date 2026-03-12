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
  optimistic: 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30',
  concerned: 'text-amber-400 bg-amber-500/20 border border-amber-500/30',
  negative: 'text-red-400 bg-red-500/20 border border-red-500/30',
  mixed: 'text-slate-300 bg-white/10 border border-white/20'
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
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Public Discourse Signals</h3>
          <p className="text-sm text-gray-400">Live sentiment from open platforms</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fca311]">
          <MessageCircle className="h-4 w-4" />
          {domain === 'all' ? 'Global view' : domain.replace('_', ' ')}
        </div>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center text-sm font-medium text-gray-400">Loading discourse...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400">{error}</div>
      ) : !discourse ? (
        <div className="h-32 flex items-center justify-center text-sm font-medium text-gray-400">Awaiting discourse data</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-black/20 border border-white/10 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Dominant Sentiment</p>
              <p className="text-2xl font-bold text-white capitalize">
                {discourse.aggregatedSentiment?.dominant || 'mixed'}
              </p>
            </div>
            <div className="bg-black/20 border border-white/10 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Audience Engagement</p>
              <p className="text-2xl font-bold text-[#fca311]">
                {discourse.totalEngagement?.toLocaleString?.() || 0}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white">
              <Activity className="h-4 w-4 text-[#fca311]" /> Sentiment Distribution
            </div>
            {sentimentDistribution.length === 0 ? (
              <p className="text-sm text-gray-500">Not enough signals yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sentimentDistribution.map(({ key, value }) => (
                  <div
                    key={key}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      sentimentColors[key] || 'bg-white/10 text-gray-300 border border-white/20'
                    }`}
                  >
                    {key}: {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white">
              <Radio className="h-4 w-4 text-[#fca311]" /> Leading Narratives
            </div>
            {discourse.discourse?.length ? (
              <div className="space-y-3">
                {discourse.discourse.map((item, idx) => (
                  <div
                    key={`${item.platform}-${idx}`}
                    className="bg-black/20 border border-white/10 rounded-xl p-5 hover:border-[#fca311]/50 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-white capitalize">{item.platform}</p>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sentimentColors[item.sentiment] || 'bg-white/10 text-gray-300 border border-white/20'
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.content}</p>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 mt-4 pt-3 border-t border-white/10">
                      <span>Engagement: <span className="text-gray-300">{item.engagement?.toLocaleString?.() || 0}</span></span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#fca311] hover:text-[#ffd166] transition-colors hover:underline flex items-center gap-1"
                      >
                        Source ↗
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
