import api from '@/lib/axios'
import type { Athlete, PaginatedResponse, AthleteSearchParams, TalentScore, Report, Video } from '@/types'

export const getAthletes = async (params?: AthleteSearchParams): Promise<PaginatedResponse<Athlete>> => {
  const response = await api.get<PaginatedResponse<Athlete>>('/athletes', { params })
  return response.data
}

export const getAthlete = async (id: number): Promise<Athlete> => {
  const response = await api.get<Athlete>(`/athletes/${id}`)
  return response.data
}

export const getAthleteVideos = async (id: number): Promise<Video[]> => {
  const response = await api.get<Video[]>(`/athletes/${id}/videos`)
  return response.data
}

export const getAthleteReports = async (id: number): Promise<Report[]> => {
  const response = await api.get<Report[]>(`/athletes/${id}/reports`)
  return response.data
}

export const getAthleteTalentScore = async (id: number): Promise<TalentScore> => {
  const response = await api.get<TalentScore>(`/athletes/${id}/talent-score`)
  return response.data
}

export const updateAthleteProfile = async (
  id: number,
  data: Partial<Athlete>
): Promise<Athlete> => {
  const response = await api.put<Athlete>(`/athletes/${id}/profile`, data)
  return response.data
}
