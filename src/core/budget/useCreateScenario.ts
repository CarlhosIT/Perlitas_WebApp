import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import type { CreateScenarioCommand } from '@/domain/budget/BudgetScenario.types'
import { SCENARIOS_QUERY_KEY } from './useGetScenarios'

export function useCreateScenario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: CreateScenarioCommand) => budgetRepository.create(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIOS_QUERY_KEY })
    },
  })
}
