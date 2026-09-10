interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

function getColor(score: number) {
  if (score >= 70) return { ring: 'ring-green-400', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' }
  if (score >= 40) return { ring: 'ring-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' }
  return { ring: 'ring-red-400', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' }
}

export default function TalentScoreBadge({ score, size = 'md', showLabel = true }: Props) {
  const colors = getColor(score)

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.badge}`}>
        ⚡ {score}
      </span>
    )
  }

  if (size === 'md') {
    return (
      <div className={`inline-flex flex-col items-center ${colors.bg} ${colors.ring} ring-2 rounded-xl px-4 py-3`}>
        <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
        {showLabel && <span className={`text-xs font-medium ${colors.text} opacity-75`}>Talent Score</span>}
      </div>
    )
  }

  // 'lg' — circular ring style
  const circumference = 2 * Math.PI * 45 // radius=45
  const strokeDashoffset = circumference - (score / 100) * circumference

  const ringColor =
    score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-sm font-semibold ${colors.text}`}>
          {score >= 70 ? '🌟 Elite' : score >= 40 ? '📈 Developing' : '🔧 Needs Work'}
        </span>
      )}
    </div>
  )
}
