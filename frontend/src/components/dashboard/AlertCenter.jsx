import { Bell, CheckCheck, Loader } from 'lucide-react'

const formatAlertTime = (value) => {
  if (!value) return 'now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'now'
  return date.toLocaleString()
}

export default function AlertCenter({
  alerts = [],
  unreadCount = 0,
  loading = false,
  onRefresh,
  onMarkRead,
  onMarkAllRead
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#fca311]" />
          <h3 className="font-semibold text-white">Alert Center</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full border border-[#fca311]/30 text-[#ffd166] bg-[#fca311]/10">
          {unreadCount} unread
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onMarkAllRead}
          className="px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 transition-colors inline-flex items-center gap-1.5"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center text-gray-400 text-sm">
          <Loader className="h-4 w-4 animate-spin mr-2" />
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-gray-400">No alerts yet. Watchlists will appear here when matches are found.</p>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div key={alert._id} className={`rounded-lg border p-3 ${alert.status === 'unread' ? 'border-[#fca311]/40 bg-[#fca311]/10' : 'border-white/10 bg-black/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-100">{alert.title}</p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{alert.message}</p>
                  {alert.eventId?._id && (
                    <p className="text-xs text-gray-400 mt-2">
                      Event: <span className="text-gray-200">{alert.eventId.title}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">{formatAlertTime(alert.createdAt)}</p>
                </div>
                {alert.status === 'unread' && (
                  <button
                    onClick={() => onMarkRead(alert._id)}
                    className="text-xs px-2 py-1 rounded border border-white/10 bg-black/20 text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
