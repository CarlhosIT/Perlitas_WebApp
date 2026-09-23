import { useQuery } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'
import type { PageParams } from '@/domain/shared/HttpResponse.types'

interface UseCostCentersOptions {
  /** Permite encadenar consultas: no dispara hasta tener los datos previos */
  enabled?: boolean
}

export function useCostCenters(params: PageParams, options?: UseCostCentersOptions) {
  return useQuery({
    queryKey: ['costCenters', params],
    queryFn: () => financeRepository.getCostCenters(params),
    enabled: options?.enabled ?? true,
  })
}
