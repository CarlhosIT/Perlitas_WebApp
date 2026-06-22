import type { AuthUser } from '@/domain/auth/Auth.types'

const KEYS = {
  ACCESS: 'perlitas_access_token',
  REFRESH: 'perlitas_refresh_token',
  USER: 'perlitas_user',
} as const

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(KEYS.ACCESS),
  getRefreshToken: (): string | null => localStorage.getItem(KEYS.REFRESH),
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(KEYS.USER)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(KEYS.ACCESS, accessToken)
    localStorage.setItem(KEYS.REFRESH, refreshToken)
  },
  setUser: (user: AuthUser): void => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },
  clear: (): void => {
    localStorage.removeItem(KEYS.ACCESS)
    localStorage.removeItem(KEYS.REFRESH)
    localStorage.removeItem(KEYS.USER)
  },
}
