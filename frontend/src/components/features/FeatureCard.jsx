import { Link } from 'react-router-dom'

export default function FeatureCard({ title, description, to, icon: Icon }) {
  return (
    <div className="p-6 card group border border-white/10 hover:border-[#fca311]/50 cursor-pointer flex flex-col h-full bg-gradient-to-br from-white/5 to-transparent">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/10 text-[#fca311] flex items-center justify-center shadow-[0_0_10px_rgba(252,163,17,0.2)] group-hover:scale-110 transition-transform">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-white group-hover:text-[#fca311] transition-colors">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 font-light leading-relaxed mb-6 flex-grow">{description}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffd166] group-hover:gap-3 transition-all mt-auto"
      >
        Explore feature
        <span aria-hidden>→</span>
      </Link>
    </div>
  )
}
