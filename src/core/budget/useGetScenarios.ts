import { useQuery } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'

export const SCENARIOS_QUERY_KEY = ['scenarios'] as const

export function useGetScenarios(year: number) {
  const filter = `FinancYear=="${year}-01-01T00:00:00"`
  return useQuery({
    queryKey: [...SCENARIOS_QUERY_KEY, year],
    queryFn: () => budgetRepository.getAll(filter),
  })
}
