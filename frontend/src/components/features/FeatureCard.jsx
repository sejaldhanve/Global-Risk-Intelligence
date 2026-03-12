import { Link } from 'react-router-dom'

export default function FeatureCard({ title, description, to, icon: Icon }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition group">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">{description}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all"
      >
        Explore feature
        <span aria-hidden>→</span>
      </Link>
    </div>
  )
}
