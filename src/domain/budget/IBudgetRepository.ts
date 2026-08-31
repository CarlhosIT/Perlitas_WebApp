import type { BudgetScenario, CreateScenarioCommand, UpdateScenarioCommand } from './BudgetScenario.types'

export interface IBudgetRepository {
  getAll(filter?: string): Promise<BudgetScenario[]>
  getById(id: number): Promise<BudgetScenario>
  create(command: CreateScenarioCommand): Promise<BudgetScenario>
  update(id: number, command: UpdateScenarioCommand): Promise<void>
  remove(id: number): Promise<void>
  uploadLines(id: number, file: File): Promise<void>
  importBudget(file: File): Promise<void>
  downloadTemplate(): Promise<Blob>
}
