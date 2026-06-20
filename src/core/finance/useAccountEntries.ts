import { useQuery } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'
import type { PageParams } from '@/domain/shared/HttpResponse.types'

export function useAccountEntries(params: PageParams) {
  return useQuery({
    queryKey: ['accountEntries', params],
    queryFn: () => financeRepository.getAccountEntries(params),
  })
}
