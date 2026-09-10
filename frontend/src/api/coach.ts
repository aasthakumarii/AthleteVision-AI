import api from '@/lib/axios'
import type { Athlete, PaginatedResponse, AthleteSearchParams, Report, Video } from '@/types'

export interface AthleteCompareResult {
  athletes: Array<
    Athlete & {
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
  >
}

export const searchAthletes = async (
  params: AthleteSearchParams
): Promise<PaginatedResponse<Athlete>> => {
  const response = await api.get<PaginatedResponse<Athlete>>('/coach/athletes', { params })
  return response.data
}

export const getAthleteProfile = async (id: number): Promise<Athlete> => {
  const response = await api.get<Athlete>(`/coach/athletes/${id}`)
  return response.data
}

export const getAthleteReports = async (id: number): Promise<Report[]> => {
  const response = await api.get<Report[]>(`/coach/athletes/${id}/reports`)
  return response.data
}

export const getAthleteVideos = async (id: number): Promise<Video[]> => {
  const response = await api.get<Video[]>(`/coach/athletes/${id}/videos`)
  return response.data
}

export const getShortlist = async (): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>('/coach/shortlist')
  return response.data
}

export const addToShortlist = async (athleteId: number): Promise<void> => {
  await api.post(`/coach/shortlist/${athleteId}`)
}

export const removeFromShortlist = async (athleteId: number): Promise<void> => {
  await api.delete(`/coach/shortlist/${athleteId}`)
}

export const compareAthletes = async (ids: number[]): Promise<AthleteCompareResult> => {
  const response = await api.get<AthleteCompareResult>('/coach/compare', {
    params: { ids: ids.join(',') },
  })
  return response.data
}
