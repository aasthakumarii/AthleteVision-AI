import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMyReports } from '@/api/reports'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import { FileBarChart, ChevronRight } from 'lucide-react'
import type { Report } from '@/types'

// Mock data
const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    athleteId: 1,
    videoId: 1,
    videoFilename: 'training_session_sep_01.mp4',
    generatedAt: '2026-09-01T12:00:00Z',
    aiSummary: 'Strong physical performance with excellent stamina levels...',
    sport: 'Football',
    metrics: {
      id: 1, videoId: 1, speed: 78, agility: 72, stamina: 85, accuracy: 68, power: 75, positioning: 70,
      distanceCovered: 10500, topSpeedKmh: 28.4, sprintCount: 12, ballTouches: 45, createdAt: '2026-09-01T12:00:00Z',
    },
    talentScore: { id: 1, athleteId: 1, score: 74, calculatedAt: '2026-09-01T12:00:00Z', breakdown: { physical: 78, technical: 72, tactical: 68, consistency: 80 } },
  },
  {
    id: 2,
    athleteId: 1,
    videoId: 2,
    videoFilename: 'match_vs_rivals_sep_05.mp4',
    generatedAt: '2026-09-05T18:00:00Z',
    aiSummary: 'Impressive match performance with high work rate...',
    sport: 'Football',
    metrics: {
      id: 2, videoId: 2, speed: 82, agility: 75, stamina: 80, accuracy: 71, power: 79, positioning: 73,
      distanceCovered: 11200, topSpeedKmh: 30.1, sprintCount: 15, ballTouches: 52, createdAt: '2026-09-05T18:00:00Z',
    },
    talentScore: { id: 2, athleteId: 1, score: 78, calculatedAt: '2026-09-05T18:00:00Z', breakdown: { physical: 82, technical: 75, tactical: 72, consistency: 83 } },
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReportsPage() {
  const navigate = useNavigate()
  const { data: reports = MOCK_REPORTS, isLoading } = useQuery({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
    placeholderData: MOCK_REPORTS,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-5 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-1/4 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
        <p className="text-gray-500 text-sm mt-1">AI-generated analysis from your uploaded videos</p>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-16">
          <FileBarChart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No reports yet</p>
          <p className="text-gray-400 text-sm mb-4">Upload a video to generate your first performance report</p>
          <button onClick={() => navigate('/athlete/upload')} className="btn-primary">
            Upload Video
          </button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Video</th>
                <th>Sport</th>
                <th>Date</th>
                <th>Talent Score</th>
                <th>Speed</th>
                <th>Stamina</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => navigate(`/athlete/reports/${report.id}`)}
                  className="cursor-pointer hover:bg-indigo-50 transition-colors"
                >
                  <td>
                    <span className="font-medium text-gray-900 truncate block max-w-xs" title={report.videoFilename}>
                      {report.videoFilename ?? `Video #${report.videoId}`}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{report.sport ?? 'N/A'}</span>
                  </td>
                  <td className="text-gray-500">{formatDate(report.generatedAt)}</td>
                  <td>
                    <TalentScoreBadge score={report.talentScore.score} size="sm" />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-gray-100 rounded-full w-16">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${report.metrics.speed}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{report.metrics.speed}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-gray-100 rounded-full w-16">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${report.metrics.stamina}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{report.metrics.stamina}</span>
                    </div>
                  </td>
                  <td>
                    <ChevronRight size={16} className="text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
