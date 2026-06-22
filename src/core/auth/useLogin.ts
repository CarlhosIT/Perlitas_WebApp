// src/core/auth/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import type { LoginCommand } from '@/domain/auth/Auth.types'
import { authRepository } from '@/infrastructure/repositories/AuthRepository'
import { tokenStorage } from '@/infrastructure/auth/tokenStorage'

export function useLogin() {
  return useMutation({
    mutationFn: (command: LoginCommand) => authRepository.login(command),
    onSuccess: (result) => {
      tokenStorage.setTokens(result.accessToken!, result.refreshToken!)
      tokenStorage.setUser(result.user)
    },
  })
}
