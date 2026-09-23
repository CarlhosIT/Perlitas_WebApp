import { describe, it, expect } from 'vitest'
import { filterAccountTree } from './filterAccountTree'
import type { AccountTreeNode } from './buildAccountTree'

function node(
  overrides: Partial<AccountTreeNode> & { accountCode: string; accountName: string }
): AccountTreeNode {
  return {
    formatCode: null,
    groupMask: 1,
    levels: 3,
    fatherNum: null,
    currTotal: 0,
    budget: 'N',
    children: [],
    ...overrides,
  }
}

describe('filterAccountTree', () => {
  const tree = [
    node({
      accountCode: '110',
      accountName: 'Activo corriente',
      children: [
        node({ accountCode: '111', accountName: 'Caja y bancos' }),
        node({ accountCode: '112', accountName: 'Crédito fiscal' }),
      ],
    }),
    node({
      accountCode: '120',
      accountName: 'Activo no corriente',
      children: [node({ accountCode: '121', accountName: 'Maquinaria' })],
    }),
  ]

  it('sin texto devuelve el árbol tal cual', () => {
    expect(filterAccountTree(tree, '')).toBe(tree)
    expect(filterAccountTree(tree, '   ')).toBe(tree)
  })

  it('conserva la rama que lleva a una coincidencia', () => {
    const result = filterAccountTree(tree, 'maquinaria')
    expect(result.map((n) => n.accountCode)).toEqual(['120'])
    expect(result[0].children.map((n) => n.accountCode)).toEqual(['121'])
  })

  it('descarta las ramas sin ninguna coincidencia', () => {
    const result = filterAccountTree(tree, 'caja')
    expect(result.map((n) => n.accountCode)).toEqual(['110'])
    expect(result[0].children.map((n) => n.accountCode)).toEqual(['111'])
  })

  it('si coincide el padre conserva todo su subárbol', () => {
    const result = filterAccountTree(tree, 'Activo corriente')
    expect(result.map((n) => n.accountCode)).toEqual(['110'])
    expect(result[0].children).toHaveLength(2)
  })

  it('ignora mayúsculas y minúsculas', () => {
    expect(filterAccountTree(tree, 'CAJA')[0].children[0].accountCode).toBe('111')
  })

  it('ignora las tildes', () => {
    const result = filterAccountTree(tree, 'credito')
    expect(result[0].children.map((n) => n.accountCode)).toEqual(['112'])
  })

  it('busca también en el código de formato', () => {
    const withFormat = [
      node({ accountCode: '110', accountName: 'Activo corriente', formatCode: '1.01' }),
    ]
    expect(filterAccountTree(withFormat, '1.01')).toHaveLength(1)
  })

  it('devuelve vacío cuando nada coincide', () => {
    expect(filterAccountTree(tree, 'zzz')).toEqual([])
  })
})
