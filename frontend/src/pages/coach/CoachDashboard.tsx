import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getShortlist } from '@/api/coach'
import { useAuthStore } from '@/store/authStore'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import { Search, Users, Heart, GitCompare, TrendingUp, User } from 'lucide-react'
import type { Athlete } from '@/types'

const MOCK_SHORTLIST: Athlete[] = [
  { id: 1, userId: 10, name: 'Arjun Mehta', sport: 'Football', position: 'Forward', age: 22, club: 'City FC', createdAt: '2026-01-01T00:00:00Z' },
  { id: 3, userId: 12, name: 'Priya Sharma', sport: 'Athletics', position: 'Sprinter', age: 19, club: 'SAI Academy', createdAt: '2026-01-01T00:00:00Z' },
]

const MOCK_SCORES: Record<number, number> = { 1: 74, 2: 68, 3: 82, 4: 71, 5: 65 }

const RECENT_ACTIVITY = [
  { id: 1, name: 'Arjun Mehta', sport: 'Football', score: 74, time: '2h ago' },
  { id: 2, name: 'Rahul Singh', sport: 'Football', score: 68, time: '1d ago' },
  { id: 3, name: 'Priya Sharma', sport: 'Athletics', score: 82, time: '2d ago' },
]

export default function CoachDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: shortlist = MOCK_SHORTLIST } = useQuery({
    queryKey: ['shortlist'],
    queryFn: getShortlist,
    placeholderData: MOCK_SHORTLIST,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Coach Dashboard 📋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Welcome back, {user?.name?.split(' ')[0]}. Here's your athlete performance overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Athletes Evaluated', value: 24, icon: <Users size={20} className="text-indigo-600" />, bg: 'bg-indigo-50' },
          { label: 'Shortlisted', value: shortlist.length, icon: <Heart size={20} className="text-red-500" />, bg: 'bg-red-50' },
          { label: 'Reports Reviewed', value: 18, icon: <TrendingUp size={20} className="text-green-600" />, bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`${s.bg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recently Viewed</h2>
            <button
              onClick={() => navigate('/coach/athletes')}
              className="text-indigo-600 text-xs font-medium hover:underline"
            >
              Search all →
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/coach/athletes/${a.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <User size={14} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.sport} · {a.time}</p>
                </div>
                <TalentScoreBadge score={a.score} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Shortlist preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Shortlist</h2>
            {shortlist.length >= 2 && (
              <button
                onClick={() => navigate('/coach/compare', { state: { ids: shortlist.slice(0, 3).map((a) => a.id) } })}
                className="text-indigo-600 text-xs font-medium hover:underline flex items-center gap-1"
              >
                <GitCompare size={12} /> Compare top 3
              </button>
            )}
          </div>
          {shortlist.length === 0 ? (
            <div className="text-center py-6">
              <Heart size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No athletes shortlisted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shortlist.slice(0, 4).map((athlete) => (
                <div
                  key={athlete.id}
                  onClick={() => navigate(`/coach/athletes/${athlete.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <User size={14} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{athlete.name}</p>
                    <p className="text-xs text-gray-400">{athlete.sport} · {athlete.position}</p>
                  </div>
                  <TalentScoreBadge score={MOCK_SCORES[athlete.id] ?? 60} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/coach/athletes')}
          className="card hover:border-indigo-200 hover:shadow-md transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
            <Search size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Search Athletes</p>
            <p className="text-xs text-gray-400">Find new talent</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/coach/athletes')}
          className="card hover:border-red-200 hover:shadow-md transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
            <Heart size={18} className="text-red-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Shortlist</p>
            <p className="text-xs text-gray-400">{shortlist.length} athletes saved</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/coach/compare')}
          className="card hover:border-purple-200 hover:shadow-md transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
            <GitCompare size={18} className="text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Compare Players</p>
            <p className="text-xs text-gray-400">Side-by-side analysis</p>
          </div>
        </button>
      </div>
    </div>
  )
}
