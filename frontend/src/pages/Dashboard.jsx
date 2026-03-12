import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingUp, Globe, Plus } from 'lucide-react'
import axios from 'axios'
import ConflictMap from '../components/maps/ConflictMap'
import EventCard from '../components/dashboard/EventCard'
import RiskChart from '../components/dashboard/RiskChart'
import StatsCard from '../components/dashboard/StatsCard'
import CreateEventModal from '../components/dashboard/CreateEventModal'
import DomainFilter from '../components/dashboard/DomainFilter'
import NarrativeRealityPanel from '../components/dashboard/NarrativeRealityPanel'
import PublicDiscoursePanel from '../components/dashboard/PublicDiscoursePanel'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [filter, domainFilter])

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

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events])
  }

  const handleEventClick = (event) => {
    navigate(`/event/${event._id}`)
  }

  const stats = {
    total: events.length,
    critical: events.filter(e => e.summary?.riskLevel === 'critical').length,
    active: events.filter(e => e.status === 'active').length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Global Conflict <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#ffd166]">Intelligence Dashboard</span>
          </h1>
          <p className="text-sm text-gray-400 font-light mt-1">
            Real-time geopolitical event monitoring and impact analysis
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
