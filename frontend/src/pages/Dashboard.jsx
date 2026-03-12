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
      <div className="flex items-center justify-between">
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
          className="px-5 py-2 bg-gradient-to-r from-[#fca311] to-[#ffd166] hover:brightness-110 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(252,163,17,0.4)] hover:shadow-[0_0_25px_rgba(252,163,17,0.6)] flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Analyze Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Events"
          value={stats.total}
          icon={Globe}
          color="primary"
        />
        <StatsCard
          title="Critical Risk"
          value={stats.critical}
          icon={AlertTriangle}
          color="danger"
        />
        <StatsCard
          title="Active Monitoring"
          value={stats.active}
          icon={TrendingUp}
          color="success"
        />
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Conflict Map</h2>
        <ConflictMap events={events} onEventClick={handleEventClick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Events</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-[#050510] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#fca311]/50 shadow-md"
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
              <div className="text-gray-400">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-center py-12">
              <Globe className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No events found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 mt-4 bg-gradient-to-r from-[#fca311] to-[#ffd166] hover:brightness-110 text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(252,163,17,0.4)]"
              >
                Analyze First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <DomainFilter 
            selectedDomain={domainFilter}
            onDomainChange={setDomainFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskChart events={events} />
        <div className="lg:col-span-2 flex">
          <div className="w-full">
            <NarrativeRealityPanel events={events} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
