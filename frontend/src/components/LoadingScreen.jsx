import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

const steps = [
  { label: 'Extracting text from PDFs...', pct: 20 },
  { label: 'Parsing question patterns...', pct: 40 },
  { label: 'Identifying topic frequencies...', pct: 60 },
  { label: 'Generating personalised study plan...', pct: 80 },
  { label: 'Finalizing analysis...', pct: 95 },
]

export default function LoadingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const pct = steps[step].pct

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        {/* Animated logo */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-orange-500/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 orange-glow flex items-center justify-center animate-pulse-ring">
              <BookOpen size={28} className="text-white" />
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-700 text-white mb-2">
          Analyzing Papers
        </h2>
        <p className="text-white/40 text-sm mb-8 font-body">
          AI is reading your past papers and building insights
        </p>

        {/* Progress bar */}
        <div className="glass-card p-1 rounded-full mb-4">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Step text */}
        <p className="text-xs font-mono text-orange-400/80 tracking-wide">
          {steps[step].label}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-orange-400' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
