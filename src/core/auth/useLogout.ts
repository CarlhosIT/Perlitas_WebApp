// src/core/auth/useLogout.ts
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '@/infrastructure/auth/tokenStorage'

export function useLogout() {
  const queryClient = useQueryClient()
  return useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    window.location.href = '/login'
  }, [queryClient])
}
