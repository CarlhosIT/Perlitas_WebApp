// src/presentation/router/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { tokenStorage } from '@/infrastructure/auth/tokenStorage'

export function ProtectedRoute() {
  const token = tokenStorage.getAccessToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
