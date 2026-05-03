import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

export default function CoverageGaps({ gaps }) {
  if (gaps.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
        <h3 className="font-display font-600 text-white text-lg">No Coverage Gaps Found</h3>
        <p className="text-white/40 text-sm mt-2">All syllabus topics appear to be covered in your past papers.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="glass-card px-6 py-5 border border-yellow-400/15 bg-yellow-400/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display font-600 text-white">Coverage Gaps Identified</h3>
            <p className="text-white/50 text-sm mt-1">
              These {gaps.length} topics were not found or were underrepresented in your past papers. Consider reviewing them separately.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {gaps.map((gap, i) => (
          <div
            key={i}
            className="glass-card px-5 py-4 flex items-center gap-4 border-l-2 border-l-yellow-400/50 hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
              <XCircle size={15} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-white/85 font-medium">{gap}</p>
              <p className="text-xs text-yellow-400/60 font-mono mt-0.5">Not covered in papers</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5 border border-orange-400/10">
        <h4 className="font-display font-500 text-white/70 text-sm mb-3">💡 Study Tip</h4>
        <p className="text-white/50 text-sm leading-relaxed">
          Coverage gaps represent topics likely to appear in upcoming exams precisely <em>because</em> they haven't been tested recently. Allocate additional study time to these areas.
        </p>
      </div>
    </div>
  )
}
