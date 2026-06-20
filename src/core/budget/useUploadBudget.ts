import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import { SCENARIOS_QUERY_KEY } from './useGetScenarios'

export function useUploadLines(scenarioId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => budgetRepository.uploadLines(scenarioId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', scenarioId] })
    },
  })
}

export function useImportBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => budgetRepository.importBudget(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIOS_QUERY_KEY })
    },
  })
}

export function useDownloadTemplate() {
  return useMutation({
    mutationFn: () => budgetRepository.downloadTemplate(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla-presupuesto.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    },
  })
}
