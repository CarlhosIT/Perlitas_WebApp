import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

export interface ScenarioTreeNode extends BudgetScenario {
  children: ScenarioTreeNode[]
}

export function buildScenarioTree(scenarios: BudgetScenario[]): ScenarioTreeNode[] {
  const nodesById = new Map<number, ScenarioTreeNode>()
  scenarios.forEach((s) => nodesById.set(s.absId, { ...s, children: [] }))

  const roots: ScenarioTreeNode[] = []
  nodesById.forEach((node) => {
    // un escenario base se puede referenciar a sí mismo (baseId === absId) en vez de usar null
    const hasRealParent = node.baseId != null && node.baseId !== node.absId
    const parent = hasRealParent ? nodesById.get(node.baseId!) : undefined
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}
