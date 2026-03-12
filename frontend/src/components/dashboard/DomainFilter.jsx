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

export default function DomainFilter({ selectedDomain, onDomainChange, embedded = false, className = '' }) {
  return (
    <div className={`${embedded ? '' : 'bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl'} ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-[#fca311]" />
        <h3 className="font-semibold text-white">Filter by Domain</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {DOMAINS.map((domain) => (
          <button
            key={domain.value}
            onClick={() => onDomainChange(domain.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
              selectedDomain === domain.value
                ? 'border-[#fca311] bg-[#fca311]/10 text-[#fca311] shadow-[0_0_15px_rgba(252,163,17,0.15)]'
                : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5 text-gray-400'
            }`}
          >
            <span className="text-2xl">{domain.icon}</span>
            <span className="font-medium text-sm tracking-wide">{domain.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
