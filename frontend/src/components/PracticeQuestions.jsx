import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

function groupByTopic(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = []
    acc[q.topic].push(q.question)
    return acc
  }, {})
}

export default function PracticeQuestions({ questions }) {
  const grouped = groupByTopic(questions)
  const topics = Object.keys(grouped)
  const [open, setOpen] = useState(topics[0] || null)

  return (
    <div className="space-y-3">
      <div className="glass-card px-6 py-4 mb-5 flex items-center gap-3">
        <HelpCircle size={16} className="text-orange-400 shrink-0" />
        <div>
          <p className="text-sm text-white/80 font-medium">{questions.length} Practice Questions</p>
          <p className="text-xs text-white/40 font-mono">Grouped by topic · click to expand</p>
        </div>
      </div>

      {topics.map(topic => {
        const isOpen = open === topic
        const qs = grouped[topic]
        return (
          <div key={topic} className={`glass-card overflow-hidden transition-all ${isOpen ? 'border-orange-400/20' : ''}`}>
            <button
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
              onClick={() => setOpen(isOpen ? null : topic)}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
                  <span className="font-mono text-xs text-orange-400 font-600">{qs.length}</span>
                </div>
                <span className="font-display font-600 text-white/90 text-sm text-left">{topic}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-5 space-y-3 border-t border-white/5 pt-4">
                {qs.map((q, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-orange-400/20 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-mono text-[10px] text-orange-400 font-700">{i + 1}</span>
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
