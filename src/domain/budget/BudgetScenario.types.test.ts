import { describe, it, expectTypeOf } from 'vitest'
import type { BudgetScenario, CreateScenarioCommand, UpdateScenarioCommand } from './BudgetScenario.types'

describe('BudgetScenario types', () => {
  it('BudgetScenario tiene los campos requeridos', () => {
    expectTypeOf<BudgetScenario>().toHaveProperty('absId')
    expectTypeOf<BudgetScenario>().toHaveProperty('name')
    expectTypeOf<BudgetScenario>().toHaveProperty('initRate')
    expectTypeOf<BudgetScenario>().toHaveProperty('financYear')
    expectTypeOf<BudgetScenario>().toHaveProperty('baseId')
  })

  it('CreateScenarioCommand no incluye absId', () => {
    expectTypeOf<CreateScenarioCommand>().not.toHaveProperty('absId')
  })

  it('UpdateScenarioCommand incluye absId', () => {
    expectTypeOf<UpdateScenarioCommand>().toHaveProperty('absId')
  })
})
