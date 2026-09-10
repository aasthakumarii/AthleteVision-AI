import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { searchAthletes, addToShortlist, removeFromShortlist } from '@/api/coach'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'
import { Search, Heart, GitCompare, ChevronUp, ChevronDown, User } from 'lucide-react'
import type { Athlete } from '@/types'

const MOCK_ATHLETES: Athlete[] = [
  { id: 1, userId: 10, name: 'Arjun Mehta', sport: 'Football', position: 'Forward', age: 22, height: 178, weight: 72, dominantFoot: 'Right', club: 'City FC', createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, userId: 11, name: 'Rahul Singh', sport: 'Football', position: 'Midfielder', age: 20, height: 174, weight: 68, dominantFoot: 'Left', club: 'United SC', createdAt: '2026-01-01T00:00:00Z' },
  { id: 3, userId: 12, name: 'Priya Sharma', sport: 'Athletics', position: 'Sprinter', age: 19, height: 165, weight: 55, club: 'SAI Academy', createdAt: '2026-01-01T00:00:00Z' },
  { id: 4, userId: 13, name: 'Vikram Nair', sport: 'Basketball', position: 'Point Guard', age: 23, height: 185, weight: 80, club: 'Blasters BC', createdAt: '2026-01-01T00:00:00Z' },
  { id: 5, userId: 14, name: 'Kavya Reddy', sport: 'Football', position: 'Goalkeeper', age: 21, height: 172, weight: 65, dominantFoot: 'Right', club: 'Eagles FC', createdAt: '2026-01-01T00:00:00Z' },
]

const MOCK_SCORES: Record<number, number> = { 1: 74, 2: 68, 3: 82, 4: 71, 5: 65 }

type SortKey = 'name' | 'sport' | 'age' | 'score'

export default function AthleteSearchPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [shortlisted, setShortlisted] = useState<Set<number>>(new Set([1]))
  const [selectedForCompare, setSelectedForCompare] = useState<Set<number>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ['coach-athletes', { query, sport }],
    queryFn: () => searchAthletes({ q: query, sport }),
    placeholderData: { content: MOCK_ATHLETES, totalElements: MOCK_ATHLETES.length, totalPages: 1, page: 0, size: 20 },
  })

  const athletes = data?.content ?? MOCK_ATHLETES

  const addMutation = useMutation({
    mutationFn: addToShortlist,
    onMutate: (id) => setShortlisted((s) => new Set([...s, id])),
    onError: (_, id) => setShortlisted((s) => { const ns = new Set(s); ns.delete(id); return ns }),
  })

  const removeMutation = useMutation({
    mutationFn: removeFromShortlist,
    onMutate: (id) => setShortlisted((s) => { const ns = new Set(s); ns.delete(id); return ns }),
    onError: (_, id) => setShortlisted((s) => new Set([...s, id])),
  })

  const toggleShortlist = (id: number) => {
    if (shortlisted.has(id)) removeMutation.mutate(id)
    else addMutation.mutate(id)
  }

  const toggleCompare = (id: number) => {
    setSelectedForCompare((s) => {
      const ns = new Set(s)
      if (ns.has(id)) ns.delete(id)
      else if (ns.size < 3) ns.add(id)
      return ns
    })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...athletes].sort((a, b) => {
    let av: any, bv: any
    if (sortKey === 'name') { av = a.name; bv = b.name }
    else if (sortKey === 'sport') { av = a.sport; bv = b.sport }
    else if (sortKey === 'age') { av = a.age; bv = b.age }
    else { av = MOCK_SCORES[a.id] ?? 0; bv = MOCK_SCORES[b.id] ?? 0 }
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })

  const filtered = sorted.filter((a) => {
    const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase())
    const matchSport = !sport || a.sport === sport
    return matchQ && matchSport
  })

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Athletes</h1>
        <p className="text-gray-500 text-sm mt-1">Discover and evaluate talent</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-52">
          <label className="block text-xs font-medium text-gray-500 mb-1">Search by name</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Arjun"
              className="input pl-8"
            />
          </div>
        </div>
        <div className="min-w-36">
          <label className="block text-xs font-medium text-gray-500 mb-1">Sport</label>
          <select value={sport} onChange={(e) => setSport(e.target.value)} className="input">
            <option value="">All Sports</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Cricket">Cricket</option>
            <option value="Athletics">Athletics</option>
          </select>
        </div>
        {selectedForCompare.size >= 2 && (
          <button
            onClick={() => navigate('/coach/compare', { state: { ids: [...selectedForCompare] } })}
            className="btn-primary flex items-center gap-2"
          >
            <GitCompare size={16} />
            Compare ({selectedForCompare.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-10"></th>
              <th
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">Name <SortIcon col="name" /></div>
              </th>
              <th
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('sport')}
              >
                <div className="flex items-center gap-1">Sport <SortIcon col="sport" /></div>
              </th>
              <th>Position</th>
              <th
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('age')}
              >
                <div className="flex items-center gap-1">Age <SortIcon col="age" /></div>
              </th>
              <th
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center gap-1">Talent Score <SortIcon col="score" /></div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No athletes found
                </td>
              </tr>
            ) : (
              filtered.map((athlete) => {
                const score = MOCK_SCORES[athlete.id] ?? 60
                const isComparing = selectedForCompare.has(athlete.id)
                const isShortlisted = shortlisted.has(athlete.id)

                return (
                  <tr key={athlete.id}>
                    <td className="pl-4">
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => toggleCompare(athlete.id)}
                        className="rounded border-gray-300 text-indigo-600"
                        disabled={!isComparing && selectedForCompare.size >= 3}
                        title="Add to comparison"
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <User size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{athlete.name}</p>
                          <p className="text-xs text-gray-400">{athlete.club}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{athlete.sport}</span></td>
                    <td className="text-gray-600">{athlete.position}</td>
                    <td className="text-gray-600">{athlete.age} yrs</td>
                    <td><TalentScoreBadge score={score} size="sm" /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/coach/athletes/${athlete.id}`)}
                          className="text-indigo-600 hover:underline text-xs font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleShortlist(athlete.id)}
                          className={`p-1 rounded-lg transition ${isShortlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}
                          title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                        >
                          <Heart size={14} fill={isShortlisted ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} athletes found
        </div>
      </div>
    </div>
  )
}
