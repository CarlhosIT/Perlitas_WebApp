export interface BudgetScenario {
  absId: number
  name: string
  baseId: number | null
  initRate: number | null
  financYear: string
  ocrCode: string | null
}

export interface CreateScenarioCommand {
  name: string
  initRate: number
  financYear: string
  baseId: number | null
  ocrCode: string | null
}

export interface UpdateScenarioCommand {
  absId: number
  name: string
  initRate: number
  financYear: string
  ocrCode: string | null
}
