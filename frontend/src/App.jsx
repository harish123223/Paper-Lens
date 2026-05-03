import { useState } from 'react'
import UploadPage from './components/UploadPage'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'

// 3-minute timeout for large PDF analysis
const TIMEOUT_MS = 3 * 60 * 1000

export default function App() {
  const [view, setView]       = useState('upload')
  const [results, setResults] = useState(null)
  const [error, setError]     = useState(null)

  const handleAnalyze = async (files, syllabus) => {
    setView('loading')
    setError(null)

    const formData = new FormData()
    files.forEach(file => formData.append('pdfs', file))
    formData.append('syllabus', syllabus)

    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Analysis failed')
      }

      const data = await res.json()
      setResults(data)
      setView('results')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError('Request timed out after 3 minutes. Try uploading fewer or smaller PDFs.')
      } else {
        setError(err.message)
      }
      setView('upload')
    }
  }

  const handleReset = () => { setView('upload'); setResults(null); setError(null) }

  return (
    <div className="min-h-screen">
      {view === 'upload'  && <UploadPage onAnalyze={handleAnalyze} error={error} />}
      {view === 'loading' && <LoadingScreen />}
      {view === 'results' && results && <Dashboard data={results} onReset={handleReset} />}
    </div>
  )
}
