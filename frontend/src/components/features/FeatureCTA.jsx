import { Link } from 'react-router-dom'

export default function FeatureCTA({ title, subtitle, links = [] }) {
  return (
    <div className="p-6 bg-gradient-to-r from-primary-50 via-white to-primary-50 border border-primary-100 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition ${
                link.variant === 'secondary'
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'border-primary-500 bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {link.label}
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
