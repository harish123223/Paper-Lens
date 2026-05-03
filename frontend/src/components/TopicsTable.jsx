import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

const ImportanceBadge = ({ importance }) => {
  if (importance === 'High') return <span className="badge-high">High</span>
  if (importance === 'Medium') return <span className="badge-medium">Medium</span>
  return <span className="badge-low">Low</span>
}

const ScoreBar = ({ score }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="font-mono text-xs text-white/50 w-8 text-right">{score}</span>
  </div>
)

export default function TopicsTable({ topics }) {
  const [sortField, setSortField] = useState('score')
  const [sortDir, setSortDir] = useState('desc')

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...topics].sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    if (typeof va === 'string') {
      return sortDir === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
    }
    return sortDir === 'desc' ? vb - va : va - vb
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-white/20" />
    if (sortDir === 'desc') return <ArrowDown size={12} className="text-orange-400" />
    return <ArrowUp size={12} className="text-orange-400" />
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="font-display font-600 text-white">All Topics Ranked</h3>
        <p className="text-white/40 text-xs font-mono mt-0.5">{topics.length} topics identified · click headers to sort</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-xs font-mono text-white/30 uppercase tracking-wider">#</th>
              {[
                { key: 'name', label: 'Topic' },
                { key: 'frequency', label: 'Frequency' },
                { key: 'importance', label: 'Importance' },
                { key: 'score', label: 'Score' },
              ].map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-mono text-white/30 uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((topic, i) => (
              <tr
                key={topic.name}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-white/20">{String(i + 1).padStart(2, '0')}</td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white/85 font-medium">{topic.name}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="font-mono text-sm text-orange-400">{topic.frequency}×</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ImportanceBadge importance={topic.importance} />
                </td>
                <td className="px-4 py-4 min-w-[140px]">
                  <ScoreBar score={topic.score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
