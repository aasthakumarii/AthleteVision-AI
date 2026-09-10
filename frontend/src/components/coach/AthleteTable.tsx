import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Eye, BarChart2 } from 'lucide-react'
import ShortlistButton from './ShortlistButton'
import type { Athlete } from '@/types'
import TalentScoreBadge from '@/components/athlete/TalentScoreBadge'

type SortKey = 'name' | 'sport' | 'age' | 'position'

const COLUMNS: { key: SortKey; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sport', label: 'Sport', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'position', label: 'Position', sortable: false },
]

interface AthleteTableProps {
  athletes: Athlete[]
  scores?: Record<number, number>
  shortlistedIds?: Set<number>
  onView: (id: number) => void
  onShortlist: (id: number) => void
  selectedIds: number[]
  onToggleSelect: (id: number) => void
}

const AthleteTable: React.FC<AthleteTableProps> = ({
  athletes,
  scores = {},
  shortlistedIds = new Set(),
  onView,
  onShortlist,
  selectedIds,
  onToggleSelect,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortOrder('asc') }
  }

  const sorted = [...athletes].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number)
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (colKey !== sortKey) return <ChevronUp size={12} className="text-gray-300 ml-1 inline" />
    return sortOrder === 'asc'
      ? <ChevronUp size={12} className="text-indigo-600 ml-1 inline" />
      : <ChevronDown size={12} className="text-indigo-600 ml-1 inline" />
  }

  if (athletes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <BarChart2 size={48} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No athletes found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={athletes.length > 0 && athletes.every((a) => selectedIds.includes(a.id))}
                onChange={() => {
                  const allSelected = athletes.every((a) => selectedIds.includes(a.id))
                  athletes.forEach((a) => {
                    if (allSelected) { if (selectedIds.includes(a.id)) onToggleSelect(a.id) }
                    else { if (!selectedIds.includes(a.id)) onToggleSelect(a.id) }
                  })
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs ${col.sortable ? 'cursor-pointer select-none hover:text-indigo-600' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && <SortIcon colKey={col.key} />}
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs">Talent Score</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((athlete) => {
            const isSelected = selectedIds.includes(athlete.id)
            const score = scores[athlete.id] ?? 60
            const isShortlisted = shortlistedIds.has(athlete.id)
            return (
              <tr key={athlete.id} onClick={() => onView(athlete.id)} className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(athlete.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shrink-0">
                      {athlete.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span className="font-medium text-gray-900">{athlete.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{athlete.sport}</td>
                <td className="px-4 py-3 text-gray-600">{athlete.age}</td>
                <td className="px-4 py-3 text-gray-600">{athlete.position}</td>
                <td className="px-4 py-3"><TalentScoreBadge score={score} size="sm" /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(athlete.id)} title="View Profile" className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Eye size={16} />
                    </button>
                    <ShortlistButton athleteId={athlete.id} isShortlisted={isShortlisted} onToggle={() => onShortlist(athlete.id)} size="sm" />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AthleteTable
