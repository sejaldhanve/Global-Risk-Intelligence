export default function FeatureDescription({ title, children }) {
  return (
    <div className="p-6 card">
      {title && <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>}
      <div className="text-sm text-gray-400 font-light leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
