import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 border border-orange-400/20">
        <p className="font-display font-600 text-white text-sm">{payload[0].payload.name}</p>
        <p className="text-orange-400 font-mono text-xs mt-1">
          {payload[0].value} appearances
        </p>
      </div>
    )
  }
  return null
}

export default function TopicsChart({ topics }) {
  const sorted = [...topics].sort((a, b) => b.frequency - a.frequency).slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
        <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v.length > 16 ? v.slice(0, 16) + '…' : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="frequency" radius={[0, 6, 6, 0]}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={`rgba(249,115,22,${1 - i * 0.07})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
