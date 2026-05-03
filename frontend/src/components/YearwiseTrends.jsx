import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="glass-card px-4 py-3 border border-orange-400/20">
        <p className="font-display font-600 text-white text-sm">{d.year}</p>
        <p className="text-orange-400 font-mono text-xs mt-1">Top: {d.top_topic}</p>
        <p className="text-white/50 font-mono text-xs">Count: {d.count}</p>
      </div>
    )
  }
  return null
}

export default function YearwiseTrends({ trends }) {
  return (
    <div className="space-y-5">
      <div className="glass-card p-6">
        <h3 className="font-display font-600 text-white mb-1">Year-wise Topic Distribution</h3>
        <p className="text-white/40 text-xs font-mono mb-6">Most dominant topics per paper/year</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <XAxis
              dataKey="year"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {trends.map((_, i) => (
                <Cell key={i} fill={`rgba(249,115,22,${0.4 + (i % 5) * 0.12})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h4 className="font-display font-600 text-white text-sm">Trend Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Year / Paper', 'Top Topic', 'Question Count'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-mono text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trends.map((t, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-orange-400 font-500">{t.year}</td>
                  <td className="px-6 py-4 text-sm text-white/80">{t.top_topic}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(t.count, 10) }).map((_, j) => (
                          <div key={j} className="w-1.5 h-4 rounded-sm bg-orange-400/60" />
                        ))}
                      </div>
                      <span className="font-mono text-xs text-white/40">{t.count}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
