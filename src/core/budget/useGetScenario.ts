import { useQuery } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'

export function useGetScenario(id: number) {
  return useQuery({
    queryKey: ['scenarios', id],
    queryFn: () => budgetRepository.getById(id),
    enabled: id > 0,
  })
}
