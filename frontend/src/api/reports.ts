import api from '@/lib/axios'
import type { Report, PerformanceMetric } from '@/types'

export const getMyReports = async (): Promise<Report[]> => {
  const response = await api.get<Report[]>('/reports')
  return response.data
}

export const getReport = async (id: number): Promise<Report> => {
  const response = await api.get<Report>(`/reports/${id}`)
  return response.data
}

export const getPerformanceMetrics = async (videoId: number): Promise<PerformanceMetric> => {
  const response = await api.get<PerformanceMetric>(`/performance-metrics/${videoId}`)
  return response.data
}

export const downloadReport = async (id: number): Promise<Blob> => {
  const response = await api.get(`/reports/${id}/download`, { responseType: 'blob' })
  return response.data
}
