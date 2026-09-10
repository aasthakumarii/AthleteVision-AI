import { useState, useRef, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { uploadVideo, getVideoStatus } from '@/api/videos'
import { Upload, File, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import type { VideoUploadFormData } from '@/types'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB
const ACCEPTED_TYPES = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo']

const schema = z.object({
  sport: z.string().min(1, 'Please select a sport'),
  position: z.string().min(1, 'Position is required'),
  matchDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function VideoUploadPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [reportId, setReportId] = useState<number | null>(null)
  const [uploadedVideoId, setUploadedVideoId] = useState<number | null>(null)
  const pollingRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sport: '',
      position: '',
      matchDate: new Date().toISOString().split('T')[0],
    },
  })

  // Cleanup polling on unmount
  useEffect(() => () => { if (pollingRef.current) clearInterval(pollingRef.current) }, [])

  const startPolling = (videoId: number) => {
    setUploadState('processing')
    pollingRef.current = window.setInterval(async () => {
      try {
        const status = await getVideoStatus(videoId)
        if (status.status === 'DONE') {
          clearInterval(pollingRef.current!)
          setUploadState('done')
          setReportId(status.reportId ?? null)
          queryClient.invalidateQueries({ queryKey: ['my-videos'] })
        } else if (status.status === 'FAILED') {
          clearInterval(pollingRef.current!)
          setUploadState('error')
          setErrorMessage(status.errorMessage ?? 'Video processing failed')
        }
      } catch {
        // silently retry
      }
    }, 3000)
  }

  const mutation = useMutation({
    mutationFn: ({ file, formData }: { file: File; formData: FormData }) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('sport', formData.sport)
      fd.append('position', formData.position)
      fd.append('matchDate', formData.matchDate)
      fd.append('notes', formData.notes ?? '')
      return uploadVideo(fd, setUploadProgress)
    },
    onSuccess: (video) => {
      setUploadedVideoId(video.id)
      startPolling(video.id)
    },
    onError: () => {
      setUploadState('error')
      setErrorMessage('Upload failed. Please try again.')
    },
  })

  const onSubmit = (data: FormData) => {
    if (!file) return
    setUploadState('uploading')
    setErrorMessage('')
    mutation.mutate({ file, formData: data })
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (!dropped) return
    if (!ACCEPTED_TYPES.includes(dropped.type)) {
      setErrorMessage('Only MP4, AVI, and MOV files are accepted.')
      return
    }
    if (dropped.size > MAX_FILE_SIZE) {
      setErrorMessage('File exceeds 500 MB limit.')
      return
    }
    setFile(dropped)
    setErrorMessage('')
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setErrorMessage('Only MP4, AVI, and MOV files are accepted.')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setErrorMessage('File exceeds 500 MB limit.')
      return
    }
    setFile(f)
    setErrorMessage('')
  }

  const reset = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadState('idle')
    setErrorMessage('')
    setReportId(null)
    setUploadedVideoId(null)
    if (pollingRef.current) clearInterval(pollingRef.current)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload a match or training video for AI-powered analysis
        </p>
      </div>

      {/* Success state */}
      {uploadState === 'done' && (
        <div className="card bg-green-50 border-green-200 text-center py-10">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-800">Analysis Complete!</h2>
          <p className="text-green-600 mt-1 mb-6">Your performance report is ready.</p>
          <div className="flex gap-3 justify-center">
            {reportId && (
              <button
                onClick={() => navigate(`/athlete/reports/${reportId}`)}
                className="btn-primary"
              >
                View Report
              </button>
            )}
            <button onClick={() => navigate('/athlete/reports')} className="btn-secondary">
              All Reports
            </button>
            <button onClick={reset} className="btn-secondary">
              Upload Another
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {uploadState === 'error' && (
        <div className="card bg-red-50 border-red-200 text-center py-8">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-800">Something went wrong</h2>
          <p className="text-red-600 mt-1 mb-5 text-sm">{errorMessage}</p>
          <button onClick={reset} className="btn-primary bg-red-600 hover:bg-red-700">
            Try Again
          </button>
        </div>
      )}

      {/* Processing state */}
      {uploadState === 'processing' && (
        <div className="card text-center py-10">
          <Loader size={40} className="text-indigo-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-bold text-gray-900">Analysing your video...</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Our AI is detecting players and calculating performance metrics. This may take a few minutes.
          </p>
          <div className="mt-4 flex gap-3 justify-center text-sm text-indigo-600">
            <span>🔍 Player detection</span>
            <span>📊 Tracking movement</span>
            <span>🧮 Scoring</span>
          </div>
        </div>
      )}

      {/* Upload form */}
      {(uploadState === 'idle' || uploadState === 'uploading') && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
              ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
              ${file ? 'border-indigo-400 bg-indigo-50' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.avi,.mov"
              onChange={handleFileInput}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <File size={24} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-700">Drop your video here or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">MP4, AVI, MOV · Max 500 MB</p>
              </>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errorMessage}
            </p>
          )}

          {/* Form fields */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900">Video Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport *</label>
                <select {...register('sport')} className="input">
                  <option value="">Select sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Other">Other</option>
                </select>
                {errors.sport && <p className="text-red-500 text-xs mt-1">{errors.sport.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  {...register('position')}
                  placeholder="e.g. Forward, Midfielder"
                  className="input"
                />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match / Training Date *</label>
              <input type="date" {...register('matchDate')} className="input" />
              {errors.matchDate && <p className="text-red-500 text-xs mt-1">{errors.matchDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="e.g. League match, played 90 mins, centre forward role"
                className="input resize-none"
              />
            </div>
          </div>

          {/* Upload progress */}
          {uploadState === 'uploading' && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploadState === 'uploading'}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {uploadState === 'uploading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload & Analyse
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
