import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getAthleteProfile, addToShortlist, removeFromShortlist, getAthleteReports, getAthleteVideos } from '@/api/coach'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, Heart, User, Sparkles } from 'lucide-react'
import type { Athlete, Report, Video } from '@/types'

// Mock data
const MOCK_ATHLETE: Athlete = {
  id: 1, userId: 10, name: 'Arjun Mehta', sport: 'Football', position: 'Forward',
  age: 22, height: 178, weight: 72, dominantFoot: 'Right', club: 'City FC',
  bio: 'Talented young forward with exceptional pace and finishing ability. Started playing professionally at age 18 and has been improving consistently.',
  createdAt: '2026-01-01T00:00:00Z',
}

const MOCK_METRICS_RADAR = [
  { metric: 'Speed', value: 78, fullMark: 100 },
  { metric: 'Agility', value: 72, fullMark: 100 },
  { metric: 'Stamina', value: 85, fullMark: 100 },
  { metric: 'Accuracy', value: 68, fullMark: 100 },
  { metric: 'Power', value: 75, fullMark: 100 },
  { metric: 'Positioning', value: 70, fullMark: 100 },
]

const TREND_DATA = [
  { date: 'Aug 10', score: 68 },
  { date: 'Aug 18', score: 70 },
  { date: 'Aug 25', score: 72 },
  { date: 'Sep 01', score: 74 },
  { date: 'Sep 05', score: 78 },
]

const AI_COACH_REPORT = `Arjun Mehta is a promising young forward with a well-rounded skill set. His physical profile is outstanding — elite stamina (85/100) and strong top-end speed of 28.4 km/h position him as a box-to-box threat. His pressing intensity is high, averaging 12 sprints per match. Technically, his finishing accuracy could improve (68/100), though ball retention is strong with 78% pass completion. Tactically, he reads the game well for his age (70/100 positioning). His trajectory over the past 5 sessions shows a consistent 2-3 point improvement per report, suggesting excellent coachability. Recommended for second-team integration immediately, with first-team potential within 12-18 months.`

type Tab = 'overview' | 'reports' | 'videos'

export default function AthleteProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [isShortlisted, setIsShortlisted] = useState(false)

  const { data: athlete = MOCK_ATHLETE } = useQuery({
    queryKey: ['coach-athlete', id],
    queryFn: () => getAthleteProfile(Number(id)),
    placeholderData: MOCK_ATHLETE,
  })

  const addMutation = useMutation({ mutationFn: addToShortlist, onSuccess: () => setIsShortlisted(true) })
  const removeMutation = useMutation({ mutationFn: removeFromShortlist, onSuccess: () => setIsShortlisted(false) })

  const toggleShortlist = () => {
    if (isShortlisted) removeMutation.mutate(athlete.id)
    else addMutation.mutate(athlete.id)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'reports', label: 'Reports' },
    { key: 'videos', label: 'Videos' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/coach/athletes')}
        className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm"
      >
        <ArrowLeft size={16} /> Back to search
      </button>

      {/* Profile header */}
      <div className="card flex flex-wrap gap-6 items-start">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
          <User size={28} className="text-indigo-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
            <TalentScoreBadge score={74} size="sm" />
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {athlete.sport} · {athlete.position} · {athlete.age} years · {athlete.club}
          </p>
          <p className="text-gray-400 text-sm mt-0.5">
            {athlete.height}cm · {athlete.weight}kg · {athlete.dominantFoot} foot
          </p>
          {athlete.bio && <p className="text-gray-600 text-sm mt-3 max-w-xl">{athlete.bio}</p>}
        </div>
        <button
          onClick={toggleShortlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium text-sm ${
            isShortlisted
              ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart size={16} fill={isShortlisted ? 'currentColor' : 'none'} />
          {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Performance Radar</h2>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={MOCK_METRICS_RADAR}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Score" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Trend */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Talent Score Trend</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}/100`, 'Talent Score']} />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Coach Evaluation */}
          <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-purple-600" />
              <h2 className="font-semibold text-purple-900">AI Coach Evaluation</h2>
              <span className="badge bg-purple-100 text-purple-700 text-[10px]">Gemini</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{AI_COACH_REPORT}</p>
          </div>
        </div>
      )}

      {/* Reports tab */}
      {tab === 'reports' && (
        <div className="card">
          <p className="text-gray-500 text-sm text-center py-8">
            Reports for this athlete will appear here once backend is connected.
          </p>
        </div>
      )}

      {/* Videos tab */}
      {tab === 'videos' && (
        <div className="card">
          <p className="text-gray-500 text-sm text-center py-8">
            Videos for this athlete will appear here once backend is connected.
          </p>
        </div>
      )}
    </div>
  )
}
