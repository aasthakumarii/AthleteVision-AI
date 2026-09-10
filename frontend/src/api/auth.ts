import api from '@/lib/axios'
import type { User, LoginFormData, RegisterFormData } from '@/types'

export interface AuthResponse {
  token: string
  user: User
}

// ── Demo users (used when backend is unavailable) ─────────────────────────
const DEMO_USERS: Record<string, AuthResponse> = {
  'athlete@demo.com': {
    token: 'demo_athlete_token_123',
    user: { id: 1, name: 'Arjun Mehta', email: 'athlete@demo.com', role: 'ATHLETE' },
  },
  'coach@demo.com': {
    token: 'demo_coach_token_456',
    user: { id: 2, name: 'Coach Ramesh', email: 'coach@demo.com', role: 'COACH' },
  },
}

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  } catch (err: any) {
    // If backend is not running, fall back to demo credentials
    const demo = DEMO_USERS[data.email.toLowerCase()]
    if (demo && data.password === 'demo123') {
      return demo
    }
    throw err
  }
}

export const registerUser = async (
  data: Omit<RegisterFormData, 'confirmPassword'>
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  } catch (err: any) {
    // Demo fallback – auto-create a user with the chosen role
    if (err?.code === 'ERR_NETWORK' || err?.response?.status === undefined) {
      return {
        token: `demo_${data.role.toLowerCase()}_token_new`,
        user: { id: Math.floor(Math.random() * 9000 + 1000), name: data.name, email: data.email, role: data.role },
      }
    }
    throw err
  }
}

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout').catch(() => {}) // Fire-and-forget
}
