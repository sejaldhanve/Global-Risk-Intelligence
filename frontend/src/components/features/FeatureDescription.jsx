export default function FeatureDescription({ title, children }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
