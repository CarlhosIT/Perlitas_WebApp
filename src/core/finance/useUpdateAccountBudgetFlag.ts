import { useMutation, useQueryClient } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'

export function useUpdateAccountBudgetFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ accountCode, budget }: { accountCode: string; budget: boolean }) =>
      financeRepository.updateAccountBudgetFlag(accountCode, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountEntries'] })
    },
  })
}
