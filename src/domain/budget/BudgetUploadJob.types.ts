export enum BudgetUploadJobStatus {
  Queued = 0,
  Running = 1,
  Completed = 2,
  Failed = 3,
}

export interface BudgetUploadJob {
  jobId: string
  scenarioId: number
  status: BudgetUploadJobStatus
  totalLines: number
  processedLines: number
  errors: string[] | null
  createdAt: string
  completedAt: string | null
}
