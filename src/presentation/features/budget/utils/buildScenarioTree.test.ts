import { describe, it, expect } from 'vitest'
import { buildScenarioTree } from './buildScenarioTree'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

function scenario(overrides: Partial<BudgetScenario> & { absId: number }): BudgetScenario {
  return {
    name: `Escenario ${overrides.absId}`,
    baseId: null,
    initRate: 0,
    financYear: '2026-01-01',
    ocrCode: null,
    costCenterCode: null,
    ...overrides,
  }
}

describe('buildScenarioTree', () => {
  it('devuelve una lista vacía para una lista vacía', () => {
    expect(buildScenarioTree([])).toEqual([])
  })

  it('los escenarios sin baseId son raíces sin hijos', () => {
    const scenarios = [scenario({ absId: 1 }), scenario({ absId: 2 })]
    const tree = buildScenarioTree(scenarios)
    expect(tree).toHaveLength(2)
    expect(tree.map((n) => n.absId)).toEqual([1, 2])
    expect(tree[0].children).toEqual([])
  })

  it('agrupa un hijo bajo su escenario base', () => {
    const scenarios = [
      scenario({ absId: 1 }),
      scenario({ absId: 2, baseId: 1 }),
    ]
    const tree = buildScenarioTree(scenarios)
    expect(tree).toHaveLength(1)
    expect(tree[0].absId).toBe(1)
    expect(tree[0].children).toHaveLength(1)
    expect(tree[0].children[0].absId).toBe(2)
  })

  it('soporta múltiples niveles de anidación', () => {
    const scenarios = [
      scenario({ absId: 1 }),
      scenario({ absId: 2, baseId: 1 }),
      scenario({ absId: 3, baseId: 2 }),
    ]
    const tree = buildScenarioTree(scenarios)
    expect(tree).toHaveLength(1)
    expect(tree[0].children[0].absId).toBe(2)
    expect(tree[0].children[0].children[0].absId).toBe(3)
  })

  it('trata como raíz a un escenario cuyo baseId no existe en la lista', () => {
    const scenarios = [scenario({ absId: 2, baseId: 99 })]
    const tree = buildScenarioTree(scenarios)
    expect(tree).toHaveLength(1)
    expect(tree[0].absId).toBe(2)
  })
})
