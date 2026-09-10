import { useNavigate } from 'react-router-dom'
import { Play, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { Video } from '@/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusConfig = {
  DONE: { label: 'Analysed', icon: <CheckCircle size={12} />, cls: 'status-done' },
  PROCESSING: { label: 'Processing...', icon: <Clock size={12} />, cls: 'status-processing' },
  FAILED: { label: 'Failed', icon: <XCircle size={12} />, cls: 'status-failed' },
}

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate()
  const status = statusConfig[video.status]

  const handleClick = () => {
    if (video.status === 'DONE') {
      navigate(`/athlete/reports?videoId=${video.id}`)
    }
  }

  return (
    <div
      className={`card p-0 overflow-hidden transition-shadow duration-200 ${
        video.status === 'DONE' ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative bg-gray-800 h-36 flex items-center justify-center">
        {video.status === 'DONE' ? (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
            <Play size={18} className="text-white ml-0.5" fill="white" />
          </div>
        ) : video.status === 'PROCESSING' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-amber-300 text-xs">Analysing...</span>
          </div>
        ) : (
          <XCircle size={24} className="text-red-400" />
        )}
        {/* Sport badge top-right */}
        <span className="absolute top-2 right-2 badge badge-blue text-[10px]">{video.sport}</span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-medium text-gray-900 text-sm truncate" title={video.filename}>
          {video.filename}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{formatDate(video.uploadedAt)}</span>
          <span className={`${status.cls} flex items-center gap-1`}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </div>
    </div>
  )
}
