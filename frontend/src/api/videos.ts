import api from '@/lib/axios'
import type { Video } from '@/types'

export interface VideoStatusResponse {
  id: number
  status: 'PROCESSING' | 'DONE' | 'FAILED'
  reportId?: number
  errorMessage?: string
}

export const uploadVideo = async (
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<Video> => {
  const response = await api.post<Video>('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
  return response.data
}

export const getVideoStatus = async (id: number): Promise<VideoStatusResponse> => {
  const response = await api.get<VideoStatusResponse>(`/videos/${id}/status`)
  return response.data
}

export const getMyVideos = async (): Promise<Video[]> => {
  const response = await api.get<Video[]>('/videos')
  return response.data
}

export const deleteVideo = async (id: number): Promise<void> => {
  await api.delete(`/videos/${id}`)
}
