import { useMemo, useState } from 'react'
import { BellPlus, Trash2, Plus, Loader } from 'lucide-react'

const riskOptions = ['all', 'critical', 'high', 'medium', 'low']

export default function WatchlistPanel({
  watchlists = [],
  onCreate,
  onDelete,
  loading = false,
  domainFilter = 'all'
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState('')
  const [riskLevel, setRiskLevel] = useState('all')
  const [formError, setFormError] = useState('')

  const defaultDomainHint = useMemo(() => (domainFilter === 'all' ? '' : domainFilter), [domainFilter])

  const resetForm = () => {
    setName('')
    setKeywords('')
    setRiskLevel('all')
    setFormError('')
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setFormError('Watchlist name is required')
      return
    }

    const payload = {
      name: name.trim(),
      description: 'Created from dashboard',
      filters: {
        domains: defaultDomainHint ? [defaultDomainHint] : [],
        riskLevels: riskLevel === 'all' ? [] : [riskLevel],
        keywords: keywords
          .split(',')
          .map(keyword => keyword.trim())
          .filter(Boolean)
      },
      notificationChannels: ['in-app']
    }

    const result = await onCreate(payload)

    if (result?.success) {
      resetForm()
      setIsExpanded(false)
    } else if (result?.error) {
      setFormError(result.error)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellPlus className="h-5 w-5 text-[#fca311]" />
          <h3 className="font-semibold text-white">Watchlists</h3>
        </div>
        <button
          onClick={() => {
            setIsExpanded(prev => !prev)
            setFormError('')
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-200 hover:border-[#fca311]/40 hover:text-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleCreate} className="space-y-3 mb-4 pb-4 border-b border-white/10">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Watchlist name"
            className="input text-sm"
            required
          />

          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords (comma separated)"
            className="input text-sm"
          />

          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="input text-sm"
          >
            {riskOptions.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Risk Levels' : level.toUpperCase()}
              </option>
            ))}
          </select>

          {defaultDomainHint && (
            <p className="text-xs text-gray-400">
              Domain preset: <span className="text-[#ffd166]">{defaultDomainHint}</span>
            </p>
          )}

          {formError && (
            <p className="text-xs text-red-400">{formError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary text-sm"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Watchlist'
            )}
          </button>
        </form>
      )}

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {watchlists.length === 0 ? (
          <p className="text-sm text-gray-400">No watchlists yet. Create one to get live alerts.</p>
        ) : (
          watchlists.map((watchlist) => (
            <div key={watchlist._id} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-100">{watchlist.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {watchlist.filters?.domains?.length ? watchlist.filters.domains.join(', ') : 'All domains'}
                    {' · '}
                    {watchlist.filters?.riskLevels?.length ? watchlist.filters.riskLevels.join(', ') : 'All risks'}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(watchlist._id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {watchlist.filters?.keywords?.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Keywords: <span className="text-gray-300">{watchlist.filters.keywords.join(', ')}</span>
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
