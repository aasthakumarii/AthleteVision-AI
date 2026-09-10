import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMyVideos } from '@/api/videos'
import { getAthleteTalentScore } from '@/api/athlete'
import { useAuthStore } from '@/store/authStore'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import VideoCard from '@/components/athlete/VideoCard'
import { Upload, FileBarChart, Video, TrendingUp } from 'lucide-react'
import type { Video as VideoType, TalentScore } from '@/types'

// ── Mock data (used as fallback if backend is unavailable) ────────────────
const MOCK_VIDEOS: VideoType[] = [
  {
    id: 1,
    athleteId: 1,
    filename: 'training_session_sep_01.mp4',
    sport: 'Football',
    uploadedAt: '2026-09-01T10:00:00Z',
    status: 'DONE',
  },
  {
    id: 2,
    athleteId: 1,
    filename: 'match_vs_rivals_sep_05.mp4',
    sport: 'Football',
    uploadedAt: '2026-09-05T15:30:00Z',
    status: 'DONE',
  },
  {
    id: 3,
    athleteId: 1,
    filename: 'practice_drills_sep_08.mp4',
    sport: 'Football',
    uploadedAt: '2026-09-08T09:00:00Z',
    status: 'PROCESSING',
  },
]

const MOCK_TALENT_SCORE: TalentScore = {
  id: 1,
  athleteId: 1,
  score: 74,
  calculatedAt: '2026-09-08T10:00:00Z',
  breakdown: { physical: 78, technical: 72, tactical: 68, consistency: 80 },
}

export default function AthleteDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: videos = MOCK_VIDEOS } = useQuery({
    queryKey: ['my-videos'],
    queryFn: getMyVideos,
    placeholderData: MOCK_VIDEOS,
  })

  const { data: talentScore = MOCK_TALENT_SCORE } = useQuery({
    queryKey: ['talent-score', user?.id],
    queryFn: () => getAthleteTalentScore(user!.id),
    enabled: !!user?.id,
    placeholderData: MOCK_TALENT_SCORE,
  })

  const doneVideos = videos.filter((v) => v.status === 'DONE')
  const processingVideos = videos.filter((v) => v.status === 'PROCESSING')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your performance overview</p>
        </div>
        <button
          onClick={() => navigate('/athlete/upload')}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Video
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Video className="text-indigo-600" size={20} />}
          label="Total Videos"
          value={videos.length}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<FileBarChart className="text-green-600" size={20} />}
          label="Reports Generated"
          value={doneVideos.length}
          bg="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp className="text-amber-600" size={20} />}
          label="Processing"
          value={processingVideos.length}
          bg="bg-amber-50"
        />
        <div className="card flex items-center gap-4">
          <TalentScoreBadge score={talentScore.score} size="md" />
          <div>
            <p className="text-xs text-gray-500">Talent Score</p>
            <p className="font-semibold text-gray-900">{talentScore.score}/100</p>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      {talentScore && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(talentScore.breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="font-medium text-gray-900">{val}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Videos</h2>
          <button
            onClick={() => navigate('/athlete/reports')}
            className="text-indigo-600 text-sm font-medium hover:underline"
          >
            View all reports →
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="card text-center py-12">
            <Video size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No videos yet</p>
            <p className="text-gray-400 text-sm mb-4">Upload your first match or training video</p>
            <button
              onClick={() => navigate('/athlete/upload')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bg: string
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
