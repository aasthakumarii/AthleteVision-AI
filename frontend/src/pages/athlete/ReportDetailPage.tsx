import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getReport } from '@/api/reports'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, Download, Sparkles } from 'lucide-react'
import type { Report } from '@/types'

// Mock report for demo
const MOCK_REPORT: Report = {
  id: 1,
  athleteId: 1,
  videoId: 1,
  videoFilename: 'training_session_sep_01.mp4',
  sport: 'Football',
  generatedAt: '2026-09-01T12:00:00Z',
  aiSummary: `This athlete demonstrates an exceptional level of physical conditioning, consistently maintaining high work rates throughout the session. Notable strengths include elite stamina (85/100) and impressive top-end speed reaching 28.4 km/h. The positioning score (70/100) indicates good tactical awareness, though there is room to improve decision-making in the final third. Ball retention rate was strong with 45 touches and 78% pass accuracy. Recommend focusing on agility drills and one-on-one attacking scenarios to elevate the technical score. Overall trajectory is positive — a 6-point improvement from the previous session shows consistent development.`,
  metrics: {
    id: 1, videoId: 1,
    speed: 78, agility: 72, stamina: 85, accuracy: 68, power: 75, positioning: 70,
    distanceCovered: 10500, topSpeedKmh: 28.4, sprintCount: 12, ballTouches: 45, createdAt: '2026-09-01T12:00:00Z',
  },
  talentScore: {
    id: 1, athleteId: 1, score: 74, calculatedAt: '2026-09-01T12:00:00Z',
    breakdown: { physical: 78, technical: 72, tactical: 68, consistency: 80 },
  },
}

// Mock trend data (last 5 reports)
const TREND_DATA = [
  { date: 'Aug 10', speed: 70, agility: 65, stamina: 78 },
  { date: 'Aug 18', speed: 72, agility: 67, stamina: 80 },
  { date: 'Aug 25', speed: 75, agility: 69, stamina: 82 },
  { date: 'Sep 01', speed: 78, agility: 72, stamina: 85 },
  { date: 'Sep 05', speed: 82, agility: 75, stamina: 80 },
]

const METRIC_LABELS: Record<string, string> = {
  speed: 'Speed', agility: 'Agility', stamina: 'Stamina',
  accuracy: 'Accuracy', power: 'Power', positioning: 'Positioning',
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: report = MOCK_REPORT, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReport(Number(id)),
    enabled: !!id,
    placeholderData: MOCK_REPORT,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    )
  }

  const radarData = Object.entries(METRIC_LABELS).map(([key, label]) => ({
    metric: label,
    value: report.metrics[key as keyof typeof report.metrics] as number,
    fullMark: 100,
  }))

  const metricRows = Object.entries(METRIC_LABELS).map(([key, label]) => {
    const val = report.metrics[key as keyof typeof report.metrics] as number
    return { label, value: val, percentile: Math.round(val * 0.9 + 5) }
  })

  const handleDownload = () => {
    alert('PDF download will be available once the backend /reports/:id/download endpoint is ready.')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/athlete/reports')}
          className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {report.videoFilename} · {report.sport} ·{' '}
            {new Date(report.generatedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
          <Download size={16} />
          Download PDF
        </button>
      </div>

      {/* Score + quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex items-center justify-center md:col-span-1">
          <TalentScoreBadge score={report.talentScore.score} size="lg" />
        </div>
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Distance', value: `${((report.metrics.distanceCovered ?? 0) / 1000).toFixed(1)} km`, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Top Speed', value: `${report.metrics.topSpeedKmh ?? '—'} km/h`, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Sprints', value: report.metrics.sprintCount ?? '—', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Touches', value: report.metrics.ballTouches ?? '—', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label} className={`card ${s.bg}`}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Performance Radar</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip formatter={(val) => [`${val}/100`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend line chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="Speed" />
              <Line type="monotone" dataKey="agility" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="Agility" />
              <Line type="monotone" dataKey="stamina" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Stamina" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics breakdown table */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Metrics Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Score</th>
                <th>Visual</th>
                <th>Percentile</th>
                <th>vs Avg</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => {
                const avg = 60
                const diff = row.value - avg
                return (
                  <tr key={row.label}>
                    <td className="font-medium text-gray-900">{row.label}</td>
                    <td className="font-semibold">{row.value}<span className="text-gray-400 font-normal">/100</span></td>
                    <td>
                      <div className="h-2 bg-gray-100 rounded-full w-32">
                        <div
                          className={`h-full rounded-full ${row.value >= 70 ? 'bg-green-500' : row.value >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                          style={{ width: `${row.value}%` }}
                        />
                      </div>
                    </td>
                    <td className="text-gray-500">Top {100 - row.percentile}%</td>
                    <td>
                      <span className={diff >= 0 ? 'text-green-600' : 'text-red-500'}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Summary */}
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-purple-600" />
          <h2 className="font-semibold text-purple-900">AI Performance Summary</h2>
          <span className="badge bg-purple-100 text-purple-700 text-[10px]">Gemini</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{report.aiSummary}</p>
      </div>
    </div>
  )
}
