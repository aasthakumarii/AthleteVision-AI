export interface User {
  id: number
  name: string
  email: string
  role: 'ATHLETE' | 'COACH'
  avatarUrl?: string
}

export interface Athlete {
  id: number
  userId: number
  name: string
  sport: string
  position: string
  age: number
  height?: number   // cm
  weight?: number   // kg
  dominantFoot?: 'Left' | 'Right' | 'Both'
  nationality?: string
  club?: string
  bio?: string
  avatarUrl?: string
  createdAt: string
}

export interface Video {
  id: number
  athleteId: number
  filename: string
  sport: string
  position?: string
  notes?: string
  matchDate?: string
  uploadedAt: string
  status: 'PROCESSING' | 'DONE' | 'FAILED'
  s3Url?: string
  durationSeconds?: number
}

export interface PerformanceMetric {
  id: number
  videoId: number
  reportId?: number
  speed: number          // 0-100
  agility: number        // 0-100
  stamina: number        // 0-100
  accuracy: number       // 0-100
  power: number          // 0-100
  positioning: number    // 0-100
  distanceCovered?: number  // meters
  topSpeedKmh?: number
  sprintCount?: number
  ballTouches?: number
  createdAt: string
}

export interface TalentScore {
  id: number
  athleteId: number
  score: number          // 0-100
  calculatedAt: string
  breakdown: {
    physical: number
    technical: number
    tactical: number
    consistency: number
  }
}

export interface Report {
  id: number
  athleteId: number
  videoId: number
  videoFilename?: string
  generatedAt: string
  aiSummary: string
  metrics: PerformanceMetric
  talentScore: TalentScore
  sport?: string
}

// API response wrappers
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface ApiError {
  message: string
  status: number
  timestamp: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'ATHLETE' | 'COACH'
}

export interface VideoUploadFormData {
  sport: string
  position: string
  matchDate: string
  notes: string
}

export interface AthleteSearchParams {
  q?: string
  sport?: string
  minAge?: number
  maxAge?: number
  minScore?: number
  maxScore?: number
  position?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
