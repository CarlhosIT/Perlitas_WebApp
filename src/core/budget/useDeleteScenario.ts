import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import { SCENARIOS_QUERY_KEY } from './useGetScenarios'

export function useDeleteScenario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => budgetRepository.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIOS_QUERY_KEY })
    },
  })
}
