export default function StatsCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-[#fca311]/20 text-[#fca311] border border-[#fca311]/30 shadow-[0_0_15px_rgba(252,163,17,0.2)]',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-1 tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  )
}

