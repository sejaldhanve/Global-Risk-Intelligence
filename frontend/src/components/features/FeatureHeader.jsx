export default function FeatureHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="space-y-3 relative z-10">
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.2em] text-[#fca311] font-semibold drop-shadow-[0_0_8px_rgba(252,163,17,0.4)]">
          {eyebrow}
        </span>
      )}
      {title && (
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
      )}
      {subtitle && <p className="text-base text-gray-400 font-light max-w-3xl leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  )
}
