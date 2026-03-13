import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import axios from 'axios'

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/event', { query })
      onEventCreated(response.data.event)
      setQuery('')
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#fca311]/40 via-[#ffd166]/20 to-transparent opacity-60 blur" />
        <div className="relative bg-[#050510]/95 border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#fca311]/70 mb-1">Rapid Analysis</p>
              <h2 className="text-2xl font-extrabold text-white">Analyze New Event</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Event Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input h-32 bg-black/60 border-white/20 text-gray-100 placeholder:text-gray-500 focus:border-[#fca311] focus:ring-[#fca311]/30"
                placeholder="e.g., Ukraine conflict impact on oil prices"
                required
              />
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Describe the geopolitical event you want to analyze. The system will search, analyze, and create a comprehensive report.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
