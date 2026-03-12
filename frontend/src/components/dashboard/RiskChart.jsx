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
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-white">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
          <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#050510', borderColor: '#ffffff1a', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
