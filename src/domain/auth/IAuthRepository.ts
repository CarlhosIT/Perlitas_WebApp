// src/domain/auth/IAuthRepository.ts
import type { LoginCommand, AuthResult } from './Auth.types'

export interface IAuthRepository {
  login(command: LoginCommand): Promise<AuthResult>
  refresh(refreshToken: string): Promise<AuthResult>
}
