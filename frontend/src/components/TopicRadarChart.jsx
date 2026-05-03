import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="glass-card px-4 py-3 border border-orange-400/20">
        <p className="font-display font-600 text-white text-sm">{d.topic}</p>
        <p className="text-orange-400 font-mono text-xs mt-1">Score: {d.score}</p>
        <p className="text-blue-400 font-mono text-xs">Frequency: {d.frequency}</p>
      </div>
    )
  }
  return null
}

export default function TopicRadarChart({ topics }) {
  const top8 = [...topics].sort((a, b) => b.score - a.score).slice(0, 8)

  const data = top8.map(t => ({
    topic: t.name.length > 14 ? t.name.slice(0, 14) + '…' : t.name,
    score: t.score,
    frequency: Math.min(t.frequency * 10, 100),
  }))

  return (
    <div className="space-y-5">
      <div className="glass-card p-5">
        <h3 className="font-display font-600 text-white mb-1">Topic Radar — Score vs Frequency</h3>
        <p className="text-white/40 text-xs font-mono mb-6">
          Top 8 topics plotted on two axes · larger area = higher combined importance
        </p>
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="topic"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: 'DM Sans' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickCount={4}
            />
            <Radar
              name="AI Score"
              dataKey="score"
              stroke="rgba(249,115,22,0.9)"
              fill="rgba(249,115,22,0.18)"
              strokeWidth={2}
            />
            <Radar
              name="Frequency (×10)"
              dataKey="frequency"
              stroke="rgba(96,165,250,0.9)"
              fill="rgba(96,165,250,0.12)"
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DM Sans' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {top8.slice(0, 3).map((t, i) => (
          <div key={t.name} className="glass-card px-5 py-4 border-l-2 border-l-orange-400/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-white/25">#{i + 1}</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                t.importance === 'High'   ? 'bg-orange-500/20 text-orange-400' :
                t.importance === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-blue-500/20 text-blue-400'
              }`}>{t.importance}</span>
            </div>
            <p className="text-sm text-white/85 font-medium leading-snug">{t.name}</p>
            <div className="flex gap-4 mt-2">
              <span className="font-mono text-xs text-orange-400">Score {t.score}</span>
              <span className="font-mono text-xs text-blue-400">{t.frequency}× freq</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
