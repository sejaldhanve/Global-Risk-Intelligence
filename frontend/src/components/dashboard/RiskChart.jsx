import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function RiskChart({ events = [] }) {
  const riskCounts = events.reduce((acc, event) => {
    const risk = event.summary?.riskLevel || 'medium'
    acc[risk] = (acc[risk] || 0) + 1
    return acc
  }, {})

  const data = [
    { name: 'Critical', count: riskCounts.critical || 0, fill: '#dc2626' },
    { name: 'High', count: riskCounts.high || 0, fill: '#f97316' },
    { name: 'Medium', count: riskCounts.medium || 0, fill: '#eab308' },
    { name: 'Low', count: riskCounts.low || 0, fill: '#22c55e' }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
