import { Layers, Repeat2, FileText, CheckCircle2 } from 'lucide-react'

export default function CommonInsights({ commonTopics, commonQuestions }) {
  const hasTopics    = commonTopics?.length > 0
  const hasQuestions = commonQuestions?.length > 0

  if (!hasTopics && !hasQuestions) {
    return (
      <div className="glass-card p-10 text-center">
        <CheckCircle2 size={40} className="text-white/20 mx-auto mb-4" />
        <h3 className="font-display font-600 text-white text-lg">No Cross-Paper Patterns Found</h3>
        <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">
          Upload 2 or more past papers to see which topics and question types repeat across them.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Common Topics */}
      {hasTopics && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Layers size={15} className="text-orange-400" />
            </div>
            <div>
              <h3 className="font-display font-600 text-white">Common Topics Across Papers</h3>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                {commonTopics.length} topic{commonTopics.length !== 1 ? 's' : ''} found in multiple papers — prioritise these
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {commonTopics.map((t, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                {/* Rank */}
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <p className="text-sm text-white/90 font-medium">{t.name}</p>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      t.importance === 'High'   ? 'bg-orange-500/20 text-orange-400' :
                      t.importance === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                  'bg-blue-500/20 text-blue-400'
                    }`}>{t.importance}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                      {t.frequency}× total
                    </span>
                  </div>

                  {/* Paper pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(t.papers_found || []).map((paper, j) => (
                      <div key={j} className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
                        <FileText size={10} className="text-orange-400/70" />
                        <span className="text-[10px] font-mono text-orange-400/90 max-w-[160px] truncate">{paper}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequency bubble */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                  <span className="font-mono text-xs font-700 text-orange-400">{t.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Questions */}
      {hasQuestions && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Repeat2 size={15} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-display font-600 text-white">Recurring Question Patterns</h3>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                {commonQuestions.length} question type{commonQuestions.length !== 1 ? 's' : ''} that repeat across papers — very likely to appear again
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {commonQuestions.map((q, i) => (
              <div key={i} className="px-6 py-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-4">
                  {/* Number */}
                  <div className="w-7 h-7 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-[10px] text-blue-400 font-700">{i + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Topic tag */}
                    <span className="inline-block text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-2 py-0.5 mb-2">
                      {q.topic}
                    </span>

                    {/* Question pattern */}
                    <p className="text-sm text-white/85 leading-relaxed mb-3">{q.question_pattern}</p>

                    {/* Papers it appears in */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono text-white/30 self-center">Appears in:</span>
                      {(q.appears_in || []).map((paper, j) => (
                        <div key={j} className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1">
                          <FileText size={10} className="text-blue-400/70" />
                          <span className="text-[10px] font-mono text-blue-400/90 max-w-[160px] truncate">{paper}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study tip */}
      <div className="glass-card p-5 border border-orange-400/10">
        <h4 className="font-display font-500 text-white/70 text-sm mb-2">💡 Exam Strategy Tip</h4>
        <p className="text-white/50 text-sm leading-relaxed">
          Topics and question types that repeat across multiple papers are the <span className="text-orange-400">highest-probability exam content</span>. 
          Mastering these recurring patterns gives you the best return on your study time.
        </p>
      </div>
    </div>
  )
}
