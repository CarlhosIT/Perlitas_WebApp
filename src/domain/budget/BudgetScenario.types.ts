export interface BudgetScenario {
  numerator: number
  name: string
  initialRatioPercentage: number
  additionalRatioPercentage: number
  startOfFiscalYear: string
}

export interface CreateScenarioCommand {
  name: string
  initialRatioPercentage: number
  additionalRatioPercentage: number
  startOfFiscalYear: string
}

export interface UpdateScenarioCommand {
  numerator: number
  name: string
  initialRatioPercentage: number
  additionalRatioPercentage: number
  startOfFiscalYear: string
}
