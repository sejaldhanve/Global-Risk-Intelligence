import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, TrendingUp, Globe, Plus, BellRing, X } from 'lucide-react'
import axios from 'axios'
import ConflictMap from '../components/maps/ConflictMap'
import EventCard from '../components/dashboard/EventCard'
import RiskChart from '../components/dashboard/RiskChart'
import StatsCard from '../components/dashboard/StatsCard'
import CreateEventModal from '../components/dashboard/CreateEventModal'
import DomainFilter from '../components/dashboard/DomainFilter'
import NarrativeRealityPanel from '../components/dashboard/NarrativeRealityPanel'
import PublicDiscoursePanel from '../components/dashboard/PublicDiscoursePanel'
import WatchlistPanel from '../components/dashboard/WatchlistPanel'
import AlertCenter from '../components/dashboard/AlertCenter'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [watchlists, setWatchlists] = useState([])
  const [alerts, setAlerts] = useState([])
  const [unreadAlertCount, setUnreadAlertCount] = useState(0)
  const [newAlertToast, setNewAlertToast] = useState(null)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [alertLoading, setAlertLoading] = useState(false)
  const previousUnreadCountRef = useRef(null)
  const previousTopAlertIdRef = useRef(null)
  const toastTimerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [filter, domainFilter])

  useEffect(() => {
    fetchWatchlists()
    fetchAlerts()

    const pollId = setInterval(() => {
      fetchAlerts({ silent: true })
    }, 20000)

    return () => clearInterval(pollId)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.riskLevel = filter
      if (domainFilter !== 'all') {
        params.domain = domainFilter
        params.autoPopulate = true
      }
      const response = await axios.get('/api/event', { params })
      setEvents(response.data.events)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWatchlists = async () => {
    setWatchlistLoading(true)
    try {
      const response = await axios.get('/api/watchlist')
      setWatchlists(response.data.watchlists || [])
    } catch (error) {
      console.error('Failed to fetch watchlists:', error)
    } finally {
      setWatchlistLoading(false)
    }
  }

  const fetchAlerts = async ({ silent = false, runSweep = false } = {}) => {
    if (!silent) setAlertLoading(true)

    try {
      if (runSweep) {
        await axios.post('/api/alerts/sweep')
      }

      const response = await axios.get('/api/alerts', { params: { limit: 30 } })
      const nextAlerts = response.data.alerts || []
      const nextUnreadCount = response.data.unreadCount || 0
      const nextTopAlertId = nextAlerts[0]?._id || null
      const isTopAlertUnread = nextAlerts[0]?.status === 'unread'
      const previousUnreadCount = previousUnreadCountRef.current

      if (
        (previousUnreadCount !== null && nextUnreadCount > previousUnreadCount) ||
        (previousUnreadCount === null && nextUnreadCount > 0) ||
        (
          previousTopAlertIdRef.current !== null &&
          nextTopAlertId &&
          nextTopAlertId !== previousTopAlertIdRef.current &&
          isTopAlertUnread
        )
      ) {
        const increment = previousUnreadCount === null
          ? nextUnreadCount
          : Math.max(nextUnreadCount - previousUnreadCount, 1)

        setNewAlertToast({
          id: Date.now(),
          message: `${increment} new alert${increment > 1 ? 's' : ''} from your watchlist${increment > 1 ? 's' : ''}`
        })

        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current)
        }

        toastTimerRef.current = setTimeout(() => {
          setNewAlertToast(null)
        }, 4500)
      }

      setAlerts(nextAlerts)
      setUnreadAlertCount(nextUnreadCount)
      previousUnreadCountRef.current = nextUnreadCount
      previousTopAlertIdRef.current = nextTopAlertId
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      if (!silent) setAlertLoading(false)
    }
  }

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev])
    fetchAlerts({ silent: true, runSweep: true })
  }

  const handleEventClick = (event) => {
    navigate(`/event/${event._id}`)
  }

  const handleCreateWatchlist = async (payload) => {
    try {
      await axios.post('/api/watchlist', payload)
      await Promise.all([fetchWatchlists(), fetchAlerts({ silent: true })])
      return { success: true }
    } catch (error) {
      return {
        error: error.response?.data?.error || 'Failed to create watchlist'
      }
    }
  }

  const handleDeleteWatchlist = async (watchlistId) => {
    try {
      await axios.delete(`/api/watchlist/${watchlistId}`)
      await Promise.all([fetchWatchlists(), fetchAlerts({ silent: true })])
    } catch (error) {
      console.error('Failed to delete watchlist:', error)
    }
  }

  const handleMarkAlertRead = async (alertId) => {
    try {
      await axios.patch(`/api/alerts/${alertId}/read`)
      fetchAlerts({ silent: true })
    } catch (error) {
      console.error('Failed to mark alert as read:', error)
    }
  }

  const handleMarkAllAlertsRead = async () => {
    try {
      await axios.patch('/api/alerts/read-all')
      fetchAlerts({ silent: true })
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error)
    }
  }

  const stats = {
    total: events.length,
    critical: events.filter(e => e.summary?.riskLevel === 'critical').length,
    active: events.filter(e => e.status === 'active').length
  }

  return (
    <div className="space-y-6">
      {newAlertToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto animate-slide-in-right">
          <div className="bg-[#070b16]/95 border border-[#fca311]/30 backdrop-blur-md rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.45)] p-3.5 flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <BellRing className="h-4.5 w-4.5 text-[#ffd166]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-[#ffd166] uppercase">Live Alert</p>
              <p className="text-sm text-gray-100 leading-relaxed mt-0.5">{newAlertToast.message}</p>
            </div>
            <button
              onClick={() => setNewAlertToast(null)}
              className="ml-1 p-1 rounded-md border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Dismiss alert notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Global Conflict <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">Intelligence Dashboard</span>
          </h1>
          <p className="text-sm text-gray-400 font-light mt-1 flex items-center gap-2">
            Real-time geopolitical event monitoring and impact analysis
            {unreadAlertCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border border-[#fca311]/30 text-[#ffd166] bg-[#fca311]/10">
                {unreadAlertCount} new alert{unreadAlertCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#fca311] to-[#ffd166] hover:brightness-110 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(252,163,17,0.4)] hover:shadow-[0_0_25px_rgba(252,163,17,0.6)] flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>Analyze Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="animate-slide-up">
          <StatsCard
            title="Total Events"
            value={stats.total}
            icon={Globe}
            color="primary"
          />
        </div>
        <div className="animate-slide-up animation-delay-100">
          <StatsCard
            title="Critical Risk"
            value={stats.critical}
            icon={AlertTriangle}
            color="danger"
          />
        </div>
        <div className="animate-slide-up animation-delay-200">
          <StatsCard
            title="Active Monitoring"
            value={stats.active}
            icon={TrendingUp}
            color="success"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl animate-slide-up animation-delay-300">
        <h2 className="text-xl font-semibold mb-4 text-white">Conflict Map</h2>
        <ConflictMap events={events} onEventClick={handleEventClick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 animate-slide-in-right animation-delay-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Events</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-[#050510] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#fca311]/50 shadow-md cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-center py-12">
              <div className="text-gray-400 animate-pulse">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-center py-12">
              <Globe className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No events found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 mt-4 bg-gradient-to-r from-[#fca311] to-[#ffd166] hover:brightness-110 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(252,163,17,0.4)] active:scale-95"
              >
                Analyze First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id} className="transition-transform duration-300 hover:-translate-y-1">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1 animate-slide-up animation-delay-500">
          <AlertCenter
            alerts={alerts}
            unreadCount={unreadAlertCount}
            loading={alertLoading}
            onRefresh={() => fetchAlerts({ runSweep: true })}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
          />
          <WatchlistPanel
            watchlists={watchlists}
            loading={watchlistLoading}
            onCreate={handleCreateWatchlist}
            onDelete={handleDeleteWatchlist}
            domainFilter={domainFilter}
          />
          <DomainFilter 
            selectedDomain={domainFilter}
            onDomainChange={setDomainFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 animate-slide-up animation-delay-400">
          <RiskChart events={events} />
        </div>
        <div className="lg:col-span-2 flex animate-slide-up animation-delay-500">
          <div className="w-full">
            <NarrativeRealityPanel events={events} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 animate-fade-in animation-delay-600">
        <PublicDiscoursePanel domain={domainFilter} />
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  )
}
