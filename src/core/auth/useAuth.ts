// src/core/auth/useAuth.ts
import { tokenStorage } from '@/infrastructure/auth/tokenStorage'

export function useAuth() {
  const user = tokenStorage.getUser()
  const isAuthenticated = !!tokenStorage.getAccessToken()
  return { user, isAuthenticated }
}
