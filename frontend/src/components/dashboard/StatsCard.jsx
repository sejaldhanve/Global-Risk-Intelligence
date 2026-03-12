export default function StatsCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-orange-100 text-orange-600',
    success: 'bg-green-100 text-green-600'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  )
}
