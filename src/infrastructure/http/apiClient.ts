import axios from 'axios'
import type { HttpResponse } from '@/domain/shared/HttpResponse.types'
import { API_CONFIG } from '../config/api.config'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  (error) => {
    const message =
      error.response?.data?.errorMessage ??
      error.message ??
      'Error de conexión'
    return Promise.reject(new Error(message))
  }
)
