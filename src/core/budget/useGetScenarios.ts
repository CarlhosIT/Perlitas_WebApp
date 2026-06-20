import { useQuery } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'

export const SCENARIOS_QUERY_KEY = ['scenarios'] as const

export function useGetScenarios() {
  return useQuery({
    queryKey: SCENARIOS_QUERY_KEY,
    queryFn: () => budgetRepository.getAll(),
  })
}
