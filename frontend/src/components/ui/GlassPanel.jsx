export function GlassPanel({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(5,5,16,0.4)] p-6 text-white ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
