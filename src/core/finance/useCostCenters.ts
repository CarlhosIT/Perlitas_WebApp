import { useQuery } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'
import type { PageParams } from '@/domain/shared/HttpResponse.types'

export function useCostCenters(params: PageParams) {
  return useQuery({
    queryKey: ['costCenters', params],
    queryFn: () => financeRepository.getCostCenters(params),
  })
}
