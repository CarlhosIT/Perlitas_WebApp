import { useQuery } from '@tanstack/react-query'
import { budgetRepository } from '@/infrastructure/repositories/BudgetRepository'
import { BudgetUploadJobStatus } from '@/domain/budget/BudgetUploadJob.types'
import type { BudgetUploadJob } from '@/domain/budget/BudgetUploadJob.types'

export const SCENARIO_JOBS_QUERY_KEY = 'scenarioJobs' as const

const POLL_INTERVAL_MS = 3000

export function getLatestJob(jobs: BudgetUploadJob[] | undefined): BudgetUploadJob | undefined {
  if (!jobs || jobs.length === 0) return undefined
  return [...jobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
}

export function useScenarioJobs(scenarioId: number) {
  return useQuery({
    queryKey: [SCENARIO_JOBS_QUERY_KEY, scenarioId],
    queryFn: () => budgetRepository.getScenarioJobs(scenarioId),
    enabled: scenarioId > 0,
    refetchInterval: (query) => {
      const latest = getLatestJob(query.state.data)
      const inProgress =
        latest?.status === BudgetUploadJobStatus.Queued ||
        latest?.status === BudgetUploadJobStatus.Running
      return inProgress ? POLL_INTERVAL_MS : false
    },
  })
}
