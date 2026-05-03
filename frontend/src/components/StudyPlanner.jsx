import { Clock, Flame, TrendingDown, Minus } from 'lucide-react'

const PriorityIcon = ({ priority }) => {
  if (priority === 'High') return <Flame size={13} className="text-orange-400" />
  if (priority === 'Medium') return <Minus size={13} className="text-yellow-400" />
  return <TrendingDown size={13} className="text-blue-400" />
}

const priorityBg = {
  High: 'border-l-orange-400 bg-orange-400/5',
  Medium: 'border-l-yellow-400 bg-yellow-400/5',
  Low: 'border-l-blue-400 bg-blue-400/5',
}

export default function StudyPlanner({ plan }) {
  const totalHours = plan.reduce((sum, d) => sum + d.hours, 0)
  const highCount = plan.filter(d => d.priority === 'High').length

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Days', value: plan.length, color: 'text-orange-400' },
          { label: 'Total Hours', value: totalHours, color: 'text-blue-400' },
          { label: 'High Priority Days', value: highCount, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass-card px-5 py-4 text-center">
            <p className={`font-display text-2xl font-700 ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs font-mono mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan list */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="font-display font-600 text-white">Daily Study Schedule</h3>
          <p className="text-white/40 text-xs font-mono mt-0.5">Optimized for high-frequency topics first</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {plan.map((day, i) => (
            <div
              key={i}
              className={`flex items-center gap-5 px-6 py-4 border-l-2 transition-colors hover:bg-white/[0.02] ${priorityBg[day.priority] || 'border-l-white/20'}`}
            >
              {/* Day number */}
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <span className="font-mono text-xs text-white/60 font-500">D{day.day}</span>
              </div>

              {/* Topic */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 font-medium truncate">{day.topic}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock size={11} />
                    <span className="font-mono">{day.hours}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <PriorityIcon priority={day.priority} />
                    <span className={`font-mono ${
                      day.priority === 'High' ? 'text-orange-400' :
                      day.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>{day.priority}</span>
                  </div>
                </div>
              </div>

              {/* Hours visual */}
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: day.hours }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-2 h-6 rounded-sm ${
                      day.priority === 'High' ? 'bg-orange-400/60' :
                      day.priority === 'Medium' ? 'bg-yellow-400/60' : 'bg-blue-400/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
