import { useQuery } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'
import type { PageParams } from '@/domain/shared/HttpResponse.types'

interface UseAccountEntriesOptions {
  /** Permite encadenar consultas: no dispara hasta tener los datos previos */
  enabled?: boolean
}

export function useAccountEntries(
  params: PageParams,
  options?: UseAccountEntriesOptions
) {
  return useQuery({
    queryKey: ['accountEntries', params],
    queryFn: () => financeRepository.getAccountEntries(params),
    enabled: options?.enabled ?? true,
  })
}
