import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X, Sparkles, BookOpen, AlertCircle, ChevronRight, Info } from 'lucide-react'

const MAX_FILE_MB = 50
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

export default function UploadPage({ onAnalyze, error }) {
  const [files, setFiles]       = useState([])
  const [syllabus, setSyllabus] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [sizeWarning, setSizeWarning] = useState('')
  const fileInputRef = useRef(null)

  const addFiles = useCallback((newFiles) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    const oversized = pdfs.filter(f => f.size > MAX_FILE_BYTES)
    if (oversized.length > 0) {
      setSizeWarning(
        `${oversized.map(f => f.name).join(', ')} exceed${oversized.length === 1 ? 's' : ''} ${MAX_FILE_MB} MB. Large files are auto-truncated for analysis.`
      )
    } else {
      setSizeWarning('')
    }
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name))
      return [...prev, ...pdfs.filter(f => !existing.has(f.name))]
    })
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files)
  }, [addFiles])
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const removeFile  = (name) => setFiles(prev => prev.filter(f => f.name !== name))

  const handleSubmit = () => { if (files.length > 0) onAnalyze(files, syllabus) }

  const formatSize = (bytes) => {
    if (bytes < 1024)            return bytes + ' B'
    if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const totalSize = files.reduce((s, f) => s + f.size, 0)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center orange-glow">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-white">
            Paper<span className="text-orange-400">Lens</span>
          </span>
        </div>
        <div className="text-xs font-mono text-white/30 tracking-wider uppercase">AI Exam Intelligence</div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full mx-auto">

          {/* Title */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={13} className="text-orange-400" />
              <span className="text-xs font-mono text-orange-400 tracking-wider uppercase">AI-Powered Analysis</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-700 text-white leading-tight mb-4">
              Decode Your<br />
              <span className="text-orange-400">Past Papers</span>
            </h1>
            <p className="text-white/50 font-body text-base leading-relaxed max-w-md mx-auto">
              Upload your past exam PDFs and get instant AI insights — topic frequencies, study plans, coverage gaps, and practice questions.
            </p>
          </div>

          {/* API error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-up">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-medium">Analysis failed</p>
                <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Size warning */}
          {sizeWarning && (
            <div className="mb-5 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 animate-fade-up">
              <Info size={16} className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-yellow-400/90 text-sm">{sizeWarning} Analysis will still work — only the first ~12,000 characters per file are sent to the AI.</p>
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer mb-5 animate-fade-up stagger-1 ${
              isDragging
                ? 'border-orange-400 bg-orange-500/10 scale-[1.01]'
                : 'border-white/15 hover:border-orange-400/50 hover:bg-white/[0.02]'
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={e => addFiles(e.target.files)}
            />
            <div className="py-12 flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-orange-500 orange-glow' : 'bg-white/5'
              }`}>
                <Upload size={28} className={isDragging ? 'text-white' : 'text-white/40'} />
              </div>
              <div className="text-center">
                <p className="font-display font-600 text-white text-base">
                  {isDragging ? 'Drop your PDFs here' : 'Drag & drop past papers'}
                </p>
                <p className="text-white/40 text-sm mt-1">or click to browse · PDF files only · up to 50 MB each</p>
              </div>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="glass-card p-4 mb-5 space-y-2 animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  {files.length} file{files.length !== 1 ? 's' : ''} queued
                </p>
                <p className="text-xs font-mono text-white/25">{formatSize(totalSize)} total</p>
              </div>
              {files.map(file => (
                <div key={file.name} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 group">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-white/30 font-mono">{formatSize(file.size)}</p>
                      {file.size > MAX_FILE_BYTES && (
                        <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                          Large — will be truncated
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(file.name) }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Syllabus */}
          <div className="mb-6 animate-fade-up stagger-2">
            <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
              Syllabus Topics <span className="text-white/20 normal-case">(optional — improves gap detection)</span>
            </label>
            <textarea
              value={syllabus}
              onChange={e => setSyllabus(e.target.value)}
              placeholder={"Paste your syllabus topics here...\ne.g. Calculus, Thermodynamics, Organic Chemistry..."}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 font-body resize-none focus:outline-none focus:border-orange-400/50 focus:bg-white/[0.05] transition-all min-h-[100px]"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={files.length === 0}
            className={`w-full py-4 rounded-xl font-display font-600 text-base flex items-center justify-center gap-3 transition-all duration-300 animate-fade-up stagger-3 ${
              files.length > 0
                ? 'bg-orange-500 hover:bg-orange-400 text-white orange-glow hover:scale-[1.01] cursor-pointer'
                : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/5'
            }`}
          >
            <Sparkles size={18} />
            Analyze {files.length > 0 ? `${files.length} Paper${files.length !== 1 ? 's' : ''}` : 'Papers'}
            {files.length > 0 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      <footer className="py-4 text-center text-white/20 text-xs font-mono border-t border-white/5">
        AI Past Paper Analyser · Built with React + Flask
      </footer>
    </div>
  )
}
