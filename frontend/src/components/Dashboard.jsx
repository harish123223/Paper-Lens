import { useState } from 'react'
import { BookOpen, RotateCcw, TrendingUp, Target, Map, Calendar, HelpCircle, AlertTriangle, Download, Loader2, Radar, Layers } from 'lucide-react'
import TopicsChart from './TopicsChart'
import ImportancePieChart from './ImportancePieChart'
import TopicsTable from './TopicsTable'
import StudyPlanner from './StudyPlanner'
import PracticeQuestions from './PracticeQuestions'
import CoverageGaps from './CoverageGaps'
import YearwiseTrends from './YearwiseTrends'
import TopicRadarChart from './TopicRadarChart'
import CommonInsights from './CommonInsights'

const tabs = [
  { id: 'overview',  label: 'Overview',        icon: TrendingUp   },
  { id: 'common',    label: 'Common Patterns',  icon: Layers       },
  { id: 'topics',    label: 'Topic Analysis',   icon: Target       },
  { id: 'radar',     label: 'Radar View',       icon: Radar        },
  { id: 'trends',    label: 'Year Trends',      icon: Map          },
  { id: 'planner',   label: 'Study Plan',       icon: Calendar     },
  { id: 'practice',  label: "Practice Q's",     icon: HelpCircle   },
  { id: 'gaps',      label: 'Gaps',             icon: AlertTriangle},
]

async function exportToPDF(data) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const PAGE_W = 210
  const MARGIN = 14
  const CONTENT_W = PAGE_W - MARGIN * 2
  const orange = [249, 115, 22]
  const dark = [8, 13, 61]
  const white = [255, 255, 255]
  const grey = [160, 160, 180]

  // ── helpers ──────────────────────────────────────────────────────────────
  const addPageBg = () => {
    doc.setFillColor(...dark)
    doc.rect(0, 0, PAGE_W, 297, 'F')
  }

  const sectionTitle = (text, y) => {
    doc.setFontSize(11)
    doc.setTextColor(...orange)
    doc.setFont('helvetica', 'bold')
    doc.text(text.toUpperCase(), MARGIN, y)
    doc.setDrawColor(...orange)
    doc.setLineWidth(0.4)
    doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5)
    return y + 8
  }

  // ── Page 1: Cover ────────────────────────────────────────────────────────
  addPageBg()
  // Orange accent bar
  doc.setFillColor(...orange)
  doc.rect(0, 0, 6, 297, 'F')

  doc.setFontSize(28)
  doc.setTextColor(...white)
  doc.setFont('helvetica', 'bold')
  doc.text('PaperLens', MARGIN + 6, 50)
  doc.setFontSize(14)
  doc.setTextColor(...orange)
  doc.text('AI Past Paper Analysis Report', MARGIN + 6, 60)

  doc.setDrawColor(...orange)
  doc.setLineWidth(0.5)
  doc.line(MARGIN + 6, 65, PAGE_W - MARGIN, 65)

  const stats = [
    ['Topics Found',     data.topics?.length || 0],
    ['High Priority',    data.topics?.filter(t => t.importance === 'High').length || 0],
    ['Coverage Gaps',    data.coverage_gaps?.length || 0],
    ['Study Days',       data.study_plan?.length || 0],
  ]
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  let sx = MARGIN + 6
  stats.forEach(([label, value]) => {
    doc.setTextColor(...orange)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(String(value), sx, 85)
    doc.setFontSize(9)
    doc.setTextColor(...grey)
    doc.setFont('helvetica', 'normal')
    doc.text(label, sx, 91)
    sx += 46
  })

  doc.setFontSize(9)
  doc.setTextColor(...grey)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, MARGIN + 6, 105)

  // ── Page 2: Topics table ─────────────────────────────────────────────────
  doc.addPage()
  addPageBg()
  doc.setFillColor(...orange)
  doc.rect(0, 0, 6, 297, 'F')

  let y = 20
  y = sectionTitle('Topic Analysis', y)

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['#', 'Topic', 'Frequency', 'Importance', 'Score']],
    body: (data.topics || []).map((t, i) => [
      String(i + 1).padStart(2, '0'),
      t.name,
      `${t.frequency}×`,
      t.importance,
      `${t.score}/100`,
    ]),
    styles: { fillColor: [15, 20, 70], textColor: white, fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: orange, textColor: white, fontStyle: 'bold', fontSize: 9 },
    alternateRowStyles: { fillColor: [20, 28, 90] },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { cellWidth: 22 },
      3: { cellWidth: 24 },
      4: { cellWidth: 22 },
    },
  })

  // ── Page 3: Year trends + Coverage gaps ──────────────────────────────────
  doc.addPage()
  addPageBg()
  doc.setFillColor(...orange)
  doc.rect(0, 0, 6, 297, 'F')

  y = 20
  y = sectionTitle('Year-wise Trends', y)

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Year / Paper', 'Top Topic', 'Count']],
    body: (data.yearwise_trends || []).map(t => [t.year, t.top_topic, t.count]),
    styles: { fillColor: [15, 20, 70], textColor: white, fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: orange, textColor: white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [20, 28, 90] },
  })

  y = doc.lastAutoTable.finalY + 14
  y = sectionTitle('Coverage Gaps', y)

  if ((data.coverage_gaps || []).length === 0) {
    doc.setFontSize(10)
    doc.setTextColor(...grey)
    doc.text('No coverage gaps identified.', MARGIN, y)
  } else {
    const gapRows = (data.coverage_gaps || []).map((g, i) => [String(i + 1), g, 'Not covered in papers'])
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['#', 'Topic', 'Status']],
      body: gapRows,
      styles: { fillColor: [15, 20, 70], textColor: white, fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [180, 130, 0], textColor: white, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [20, 28, 90] },
    })
  }

  // ── Page 4: Study plan ───────────────────────────────────────────────────
  doc.addPage()
  addPageBg()
  doc.setFillColor(...orange)
  doc.rect(0, 0, 6, 297, 'F')

  y = 20
  y = sectionTitle('Study Plan', y)

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Day', 'Topic', 'Hours', 'Priority']],
    body: (data.study_plan || []).map(d => [`Day ${d.day}`, d.topic, `${d.hours}h`, d.priority]),
    styles: { fillColor: [15, 20, 70], textColor: white, fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: orange, textColor: white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [20, 28, 90] },
    columnStyles: { 2: { cellWidth: 18 }, 3: { cellWidth: 22 } },
  })

  // ── Page 5: Practice questions ───────────────────────────────────────────
  doc.addPage()
  addPageBg()
  doc.setFillColor(...orange)
  doc.rect(0, 0, 6, 297, 'F')

  y = 20
  y = sectionTitle('Practice Questions', y)

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Topic', 'Question']],
    body: (data.practice_questions || []).map(q => [q.topic, q.question]),
    styles: { fillColor: [15, 20, 70], textColor: white, fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: orange, textColor: white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [20, 28, 90] },
    columnStyles: { 0: { cellWidth: 45 } },
  })

  doc.save('PaperLens-Analysis.pdf')
}

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [exporting, setExporting] = useState(false)

  const topicCount = data.topics?.length || 0
  const highPriorityCount = data.topics?.filter(t => t.importance === 'High').length || 0
  const gapCount = data.coverage_gaps?.length || 0
  const studyDays = data.study_plan?.length || 0

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportToPDF(data)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-8 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl bg-[#080d3d]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center orange-glow">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-700 text-white">
              Paper<span className="text-orange-400">Lens</span>
            </span>
            <p className="text-[10px] font-mono text-white/30 -mt-0.5">Analysis Complete</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export PDF button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-400/30 text-orange-400 hover:text-orange-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting
              ? <Loader2 size={14} className="animate-spin" />
              : <Download size={14} />
            }
            {exporting ? 'Exporting…' : 'Export PDF'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            <RotateCcw size={14} />
            New Analysis
          </button>
        </div>
      </header>

      {/* Stats strip */}
      <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-white/5">
        {[
          { label: 'Topics Found',   value: topicCount,         color: 'text-orange-400' },
          { label: 'High Priority',  value: highPriorityCount,  color: 'text-red-400'    },
          { label: 'Coverage Gaps',  value: gapCount,           color: 'text-yellow-400' },
          { label: 'Study Days',     value: studyDays,          color: 'text-blue-400'   },
        ].map(stat => (
          <div key={stat.label} className="glass-card px-5 py-4 animate-fade-up">
            <p className={`font-display text-3xl font-700 ${stat.color}`}>{stat.value}</p>
            <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="px-6 md:px-8 pt-5 pb-0 overflow-x-auto">
        <div className="flex gap-1 min-w-max border-b border-white/5">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const showBadge = tab.id === 'common' && ((data.common_topics?.length || 0) + (data.common_questions?.length || 0)) > 0
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium font-body border-b-2 transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'border-orange-400 text-orange-400'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {showBadge && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 md:px-8 py-6 overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="glass-card p-5">
                <h3 className="font-display font-600 text-white mb-1">Topic Frequency</h3>
                <p className="text-white/40 text-xs font-mono mb-4">How often each topic appeared</p>
                <TopicsChart topics={data.topics || []} />
              </div>
              <div className="glass-card p-5">
                <h3 className="font-display font-600 text-white mb-1">Importance Distribution</h3>
                <p className="text-white/40 text-xs font-mono mb-4">High / Medium / Low breakdown</p>
                <ImportancePieChart topics={data.topics || []} />
              </div>
            </div>

            {/* Score leaderboard */}
            <div className="glass-card p-5">
              <h3 className="font-display font-600 text-white mb-1">Top Topics by Score</h3>
              <p className="text-white/40 text-xs font-mono mb-4">AI relevance score 0–100</p>
              <div className="space-y-2">
                {[...(data.topics || [])]
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 8)
                  .map((t, i) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-white/25 w-5 text-right">{i + 1}</span>
                      <span className="text-sm text-white/75 w-40 truncate">{t.name}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${t.score}%`,
                            background: `rgba(249,115,22,${1 - i * 0.09})`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-orange-400 w-8 text-right">{t.score}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'common' && (
          <div className="animate-fade-up">
            <CommonInsights
              commonTopics={data.common_topics || []}
              commonQuestions={data.common_questions || []}
            />
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="animate-fade-up">
            <TopicsTable topics={data.topics || []} />
          </div>
        )}

        {activeTab === 'radar' && (
          <div className="animate-fade-up">
            <TopicRadarChart topics={data.topics || []} />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="animate-fade-up">
            <YearwiseTrends trends={data.yearwise_trends || []} />
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="animate-fade-up">
            <StudyPlanner plan={data.study_plan || []} />
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="animate-fade-up">
            <PracticeQuestions questions={data.practice_questions || []} />
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="animate-fade-up">
            <CoverageGaps gaps={data.coverage_gaps || []} />
          </div>
        )}
      </div>
    </div>
  )
}
