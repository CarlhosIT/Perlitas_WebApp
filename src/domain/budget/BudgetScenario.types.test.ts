import { describe, it, expectTypeOf } from 'vitest'
import type { BudgetScenario, CreateScenarioCommand, UpdateScenarioCommand } from './BudgetScenario.types'

describe('BudgetScenario types', () => {
  it('BudgetScenario tiene los campos requeridos', () => {
    expectTypeOf<BudgetScenario>().toHaveProperty('numerator')
    expectTypeOf<BudgetScenario>().toHaveProperty('name')
    expectTypeOf<BudgetScenario>().toHaveProperty('initialRatioPercentage')
    expectTypeOf<BudgetScenario>().toHaveProperty('additionalRatioPercentage')
    expectTypeOf<BudgetScenario>().toHaveProperty('startOfFiscalYear')
  })

  it('CreateScenarioCommand no incluye numerator', () => {
    expectTypeOf<CreateScenarioCommand>().not.toHaveProperty('numerator')
  })

  it('UpdateScenarioCommand incluye numerator', () => {
    expectTypeOf<UpdateScenarioCommand>().toHaveProperty('numerator')
  })
})
