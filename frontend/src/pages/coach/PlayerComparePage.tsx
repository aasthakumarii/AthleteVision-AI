import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { compareAthletes } from '@/api/coach'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { GitCompare, X, Plus, Search, Download } from 'lucide-react'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'

const COLORS = ['#4f46e5', '#06b6d4', '#10b981']

interface AthleteCompareData {
  id: number
  name: string
  sport: string
  position: string
  age: number
  talentScore: number
  metrics: {
    speed: number
    agility: number
    stamina: number
    accuracy: number
    power: number
    positioning: number
  }
}

// Mock comparison data
const MOCK_COMPARE: AthleteCompareData[] = [
  { id: 1, name: 'Arjun Mehta', sport: 'Football', position: 'Forward', age: 22, talentScore: 74, metrics: { speed: 78, agility: 72, stamina: 85, accuracy: 68, power: 75, positioning: 70 } },
  { id: 2, name: 'Rahul Singh', sport: 'Football', position: 'Midfielder', age: 20, talentScore: 68, metrics: { speed: 65, agility: 80, stamina: 72, accuracy: 75, power: 62, positioning: 78 } },
  { id: 3, name: 'Priya Sharma', sport: 'Athletics', position: 'Sprinter', age: 19, talentScore: 82, metrics: { speed: 95, agility: 88, stamina: 80, accuracy: 70, power: 85, positioning: 65 } },
]

const METRIC_KEYS = ['speed', 'agility', 'stamina', 'accuracy', 'power', 'positioning'] as const
type MetricKey = typeof METRIC_KEYS[number]

const METRIC_LABELS: Record<MetricKey, string> = {
  speed: 'Speed', agility: 'Agility', stamina: 'Stamina',
  accuracy: 'Accuracy', power: 'Power', positioning: 'Positioning',
}

export default function PlayerComparePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initIds: number[] = location.state?.ids ?? [1, 3]

  const [athletes, setAthletes] = useState<AthleteCompareData[]>(
    MOCK_COMPARE.filter((a) => initIds.includes(a.id))
  )

  const radarData = METRIC_KEYS.map((key) => {
    const entry: Record<string, any> = { metric: METRIC_LABELS[key] }
    athletes.forEach((a) => { entry[a.name] = a.metrics[key] })
    return entry
  })

  const getBestWorst = (key: MetricKey) => {
    const values = athletes.map((a) => a.metrics[key])
    const max = Math.max(...values)
    const min = Math.min(...values)
    return { max, min }
  }

  const getCellClass = (val: number, key: MetricKey) => {
    const { max, min } = getBestWorst(key)
    if (athletes.length < 2) return ''
    if (val === max) return 'text-green-700 font-semibold bg-green-50'
    if (val === min) return 'text-red-600 bg-red-50'
    return ''
  }

  const addAthlete = (id: number) => {
    const a = MOCK_COMPARE.find((x) => x.id === id)
    if (a && !athletes.find((x) => x.id === id) && athletes.length < 3) {
      setAthletes([...athletes, a])
    }
  }

  const removeAthlete = (id: number) => {
    setAthletes(athletes.filter((a) => a.id !== id))
  }

  const availableToAdd = MOCK_COMPARE.filter((a) => !athletes.find((x) => x.id === a.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Player Comparison</h1>
          <p className="text-gray-500 text-sm mt-1">Compare up to 3 athletes side by side</p>
        </div>
        <button
          onClick={() => alert('Export will be available once backend is ready.')}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {athletes.length === 0 ? (
        <div className="card text-center py-16">
          <GitCompare size={48} className="text-gray-200 mx-auto mb-4" />
          <h2 className="font-semibold text-gray-600">Add athletes to compare</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">Select up to 3 athletes from the search page</p>
          <button onClick={() => navigate('/coach/athletes')} className="btn-primary inline-flex items-center gap-2">
            <Search size={16} />
            Search Athletes
          </button>
        </div>
      ) : (
        <>
          {/* Selected athletes header */}
          <div className="flex gap-4 flex-wrap items-end">
            {athletes.map((a, i) => (
              <div key={a.id} className="card flex items-center gap-3 pr-3" style={{ borderTopColor: COLORS[i], borderTopWidth: 3 }}>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.sport} · {a.position} · {a.age} yrs</p>
                  <div className="mt-2">
                    <TalentScoreBadge score={a.talentScore} size="sm" />
                  </div>
                </div>
                <button
                  onClick={() => removeAthlete(a.id)}
                  className="ml-2 text-gray-300 hover:text-red-500 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {athletes.length < 3 && availableToAdd.length > 0 && (
              <div className="card border-dashed">
                <p className="text-xs text-gray-400 mb-2">Add athlete</p>
                <div className="flex flex-col gap-1">
                  {availableToAdd.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => addAthlete(a.id)}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                    >
                      <Plus size={12} /> {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Overlay radar */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Radar Comparison</h2>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                {athletes.map((a, i) => (
                  <Radar
                    key={a.id}
                    name={a.name}
                    dataKey={a.name}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics comparison table */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Metric</th>
                  {athletes.map((a, i) => (
                    <th key={a.id} style={{ color: COLORS[i] }}>{a.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Talent score row */}
                <tr className="bg-gray-50">
                  <td className="font-semibold text-gray-700">Talent Score</td>
                  {athletes.map((a) => (
                    <td key={a.id} className="text-center">
                      <TalentScoreBadge score={a.talentScore} size="sm" />
                    </td>
                  ))}
                </tr>
                {/* Metric rows */}
                {METRIC_KEYS.map((key) => (
                  <tr key={key}>
                    <td className="font-medium text-gray-700">{METRIC_LABELS[key]}</td>
                    {athletes.map((a) => {
                      const val = a.metrics[key]
                      const cellCls = getCellClass(val, key)
                      return (
                        <td key={a.id} className={`text-center ${cellCls}`}>
                          <div className="flex flex-col items-center gap-1">
                            <span>{val}</span>
                            <div className="h-1.5 bg-gray-100 rounded-full w-20">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${val}%`, backgroundColor: COLORS[athletes.indexOf(a)] }}
                              />
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
