import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import { SCENARIO_JOBS_QUERY_KEY } from './useScenarioJobs'

export function useUploadLines(scenarioId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => budgetRepository.uploadLines(scenarioId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', scenarioId] })
      queryClient.invalidateQueries({ queryKey: [SCENARIO_JOBS_QUERY_KEY, scenarioId] })
    },
  })
}

export function useDownloadTemplate(scenarioId: number) {
  return useMutation({
    mutationFn: () => budgetRepository.downloadTemplate(scenarioId),
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
