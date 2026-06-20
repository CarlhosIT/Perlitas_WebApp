import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import type { UpdateScenarioCommand } from '@/domain/budget/BudgetScenario.types'
import { SCENARIOS_QUERY_KEY } from './useGetScenarios'

export function useUpdateScenario(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: UpdateScenarioCommand) => budgetRepository.update(id, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIOS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['scenarios', id] })
    },
  })
}
