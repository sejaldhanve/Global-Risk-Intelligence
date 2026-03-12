export default function FeatureHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="space-y-3">
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.2em] text-primary-500 font-semibold">
          {eyebrow}
        </span>
      )}
      {title && (
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h1>
      )}
      {subtitle && <p className="text-base text-gray-600 max-w-3xl">{subtitle}</p>}
      {children}
    </div>
  )
}
