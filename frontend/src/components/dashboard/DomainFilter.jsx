import { Filter } from 'lucide-react'

const DOMAINS = [
  { value: 'all', label: 'All Domains', icon: '🌐' },
  { value: 'verified_news', label: 'Verified News', icon: '📰' },
  { value: 'economic_indicators', label: 'Economic Indicators', icon: '📊' },
  { value: 'shipping_activity', label: 'Shipping Activity', icon: '🚢' },
  { value: 'energy_supply', label: 'Energy Supply', icon: '⚡' },
  { value: 'logistics_networks', label: 'Logistics Networks', icon: '📦' },
  { value: 'public_discourse', label: 'Public Discourse', icon: '💬' }
]

export default function DomainFilter({ selectedDomain, onDomainChange }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter by Domain</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {DOMAINS.map((domain) => (
          <button
            key={domain.value}
            onClick={() => onDomainChange(domain.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
              selectedDomain === domain.value
                ? 'border-primary-500 bg-primary-50 text-primary-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <span className="text-2xl">{domain.icon}</span>
            <span className="font-medium text-sm">{domain.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
