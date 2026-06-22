import type { IAuthRepository } from '@/domain/auth/IAuthRepository'
import type { LoginCommand, AuthResult } from '@/domain/auth/Auth.types'
import type { HttpResponse } from '@/domain/shared/HttpResponse.types'
import { apiClient } from '../http/apiClient'

class AuthRepositoryImpl implements IAuthRepository {
  async login(command: LoginCommand): Promise<AuthResult> {
    const response = await apiClient.post<HttpResponse<AuthResult>>('/Auth/login', command)
    return response.data.data
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const response = await apiClient.post<HttpResponse<AuthResult>>('/Auth/refresh', { refreshToken })
    return response.data.data
  }
}

export const authRepository = new AuthRepositoryImpl()
