import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  High: '#f97316',
  Medium: '#eab308',
  Low: '#3b82f6',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 border border-white/10">
        <p className="font-display font-600 text-white text-sm">{payload[0].name}</p>
        <p className="font-mono text-xs mt-1" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} topics
        </p>
      </div>
    )
  }
  return null
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontFamily="Space Grotesk" fontWeight="600">
      {value}
    </text>
  )
}

export default function ImportancePieChart({ topics }) {
  const counts = topics.reduce((acc, t) => {
    acc[t.importance] = (acc[t.importance] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(counts).map(([name, value]) => ({ name, value, fill: COLORS[name] || '#888' }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={50}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: 12 }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
