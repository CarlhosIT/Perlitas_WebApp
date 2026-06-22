// src/infrastructure/http/apiClient.ts
import axios from 'axios'
import type { HttpResponse } from '@/domain/shared/HttpResponse.types'
import type { AuthResult } from '@/domain/auth/Auth.types'
import { API_CONFIG } from '../config/api.config'
import { tokenStorage } from '../auth/tokenStorage'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Inyectar Bearer token en cada request
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Verificar succeeded + refresh en 401 + normalizar errores
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as HttpResponse<unknown>
    if (data && 'succeeded' in data && !data.succeeded) {
      const message =
        data.errorMessage ??
        data.validationErrors?.join(', ') ??
        'Error desconocido'
      return Promise.reject(new Error(message))
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    // Auto-refresh en 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = tokenStorage.getRefreshToken()

      if (refreshToken) {
        try {
          // Usar axios plano para evitar recursión del interceptor
          const refreshResponse = await axios.post<HttpResponse<AuthResult>>(
            `${API_CONFIG.BASE_URL}/Auth/refresh`,
            { refreshToken },
          )
          if (refreshResponse.data.succeeded) {
            const result = refreshResponse.data.data
            if (result) {
              tokenStorage.setTokens(result.accessToken!, result.refreshToken!)
              tokenStorage.setUser(result.user)
              originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`
              return apiClient(originalRequest)
            }
          }
        } catch {
          // refresh falló — limpiar y redirigir
        }
      }

      tokenStorage.clear()
      const sessionErr = new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
      window.location.href = '/login'
      return Promise.reject(sessionErr)
    }

    // Normalizar mensaje de error
    let message: string
    if (error.response) {
      const data = error.response.data
      if (
        data &&
        typeof data === 'object' &&
        'succeeded' in data &&
        'errorMessage' in data
      ) {
        // Estructura HttpResponse estándar
        const typed = data as HttpResponse<unknown>
        message =
          typed.errorMessage ??
          typed.validationErrors?.join(', ') ??
          `Error ${error.response.status}`
      } else if (typeof data === 'string' && data.trim().length > 0) {
        message = `HTTP ${error.response.status} – ${data.trim()}`
      } else {
        message = `HTTP ${error.response.status} – no se pudo deserializar la respuesta del servidor`
      }
    } else {
      message =
        error.message === 'Network Error'
          ? 'No se pudo conectar al servidor'
          : (error.message as string | undefined) ?? 'Error de conexión'
    }

    return Promise.reject(new Error(message))
  },
)
