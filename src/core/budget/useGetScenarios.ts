import { useQuery } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'

export const SCENARIOS_QUERY_KEY = ['scenarios'] as const

export function useGetScenarios(year: number) {
  return useQuery({
    queryKey: [...SCENARIOS_QUERY_KEY, year],
    queryFn: () => budgetRepository.getAll(String(year)),
  })
}
