// src/domain/auth/Auth.types.ts
export interface LoginCommand {
  userName: string
  password: string
}

export interface RefreshCommand {
  refreshToken: string
}

export interface AuthUser {
  userCode: string
  fullName: string
  email: string
}

export interface AuthResult {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string
  user: AuthUser
}
