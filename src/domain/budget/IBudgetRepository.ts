import type { BudgetScenario, CreateScenarioCommand, UpdateScenarioCommand } from './BudgetScenario.types'
import type { BudgetUploadJob } from './BudgetUploadJob.types'

export interface IBudgetRepository {
  getAll(filter?: string): Promise<BudgetScenario[]>
  getById(id: number): Promise<BudgetScenario>
  create(command: CreateScenarioCommand): Promise<BudgetScenario>
  update(id: number, command: UpdateScenarioCommand): Promise<void>
  remove(id: number): Promise<void>
  uploadLines(id: number, file: File): Promise<BudgetUploadJob>
  getScenarioJobs(id: number): Promise<BudgetUploadJob[]>
  downloadTemplate(id: number): Promise<Blob>
}
