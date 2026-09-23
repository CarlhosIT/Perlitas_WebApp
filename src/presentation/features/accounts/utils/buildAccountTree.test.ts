import { describe, it, expect } from 'vitest'
import { buildAccountTree, collectAccountCodes } from './buildAccountTree'
import type { AccountingEntry } from '@/domain/finance/AccountingEntry.types'

function account(
  overrides: Partial<AccountingEntry> & { accountCode: string }
): AccountingEntry {
  return {
    accountName: `Cuenta ${overrides.accountCode}`,
    formatCode: null,
    groupMask: 1,
    levels: 2,
    fatherNum: null,
    currTotal: 0,
    budget: 'N',
    ...overrides,
  }
}

const ACTIVOS = '100000000000000'

describe('buildAccountTree', () => {
  it('devuelve una lista vacía para una lista vacía', () => {
    expect(buildAccountTree([], ACTIVOS)).toEqual([])
  })

  it('las raíces son las cuentas cuyo fatherNum es la raíz pedida', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '120', fatherNum: ACTIVOS }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(tree.map((n) => n.accountCode)).toEqual(['110', '120'])
    expect(tree[0].children).toEqual([])
  })

  it('anida las hijas bajo su padre por fatherNum', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '111', fatherNum: '110', levels: 3 }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(tree).toHaveLength(1)
    expect(tree[0].children.map((n) => n.accountCode)).toEqual(['111'])
  })

  it('anida varios niveles de profundidad', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '111', fatherNum: '110', levels: 3 }),
      account({ accountCode: '1111', fatherNum: '111', levels: 4 }),
      account({ accountCode: '11111', fatherNum: '1111', levels: 5 }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(tree[0].children[0].children[0].children[0].accountCode).toBe('11111')
  })

  it('re-enraiza en una cuenta de nivel 2 devolviendo solo sus descendientes', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '111', fatherNum: '110', levels: 3 }),
      account({ accountCode: '120', fatherNum: ACTIVOS }),
      account({ accountCode: '121', fatherNum: '120', levels: 3 }),
    ]
    const tree = buildAccountTree(accounts, '110')
    expect(tree.map((n) => n.accountCode)).toEqual(['111'])
  })

  it('deja fuera las cuentas que no cuelgan de la raíz pedida', () => {
    const accounts = [
      account({ accountCode: '210', fatherNum: '200000000000000' }),
    ]
    expect(buildAccountTree(accounts, ACTIVOS)).toEqual([])
  })

  it('ordena las hermanas por código de cuenta', () => {
    const accounts = [
      account({ accountCode: '130', fatherNum: ACTIVOS }),
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '120', fatherNum: ACTIVOS }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(tree.map((n) => n.accountCode)).toEqual(['110', '120', '130'])
  })

  it('no entra en bucle con una cuenta que se referencia a sí misma', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '111', fatherNum: '111', levels: 3 }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(tree.map((n) => n.accountCode)).toEqual(['110'])
  })

  it('no entra en bucle con un ciclo entre dos cuentas', () => {
    const accounts = [
      account({ accountCode: 'A', fatherNum: ACTIVOS }),
      account({ accountCode: 'B', fatherNum: 'A' }),
      account({ accountCode: 'A2', fatherNum: 'B' }),
      account({ accountCode: 'B2', fatherNum: 'A2' }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect(collectAccountCodes(tree).size).toBe(4)
  })

  it('con raíz null toma las cuentas sin padre', () => {
    const accounts = [
      account({ accountCode: ACTIVOS, fatherNum: null, levels: 1 }),
      account({ accountCode: '110', fatherNum: ACTIVOS }),
    ]
    const tree = buildAccountTree(accounts, null)
    expect(tree.map((n) => n.accountCode)).toEqual([ACTIVOS])
    expect(tree[0].children.map((n) => n.accountCode)).toEqual(['110'])
  })
})

describe('collectAccountCodes', () => {
  it('recoge los códigos de todo el árbol', () => {
    const accounts = [
      account({ accountCode: '110', fatherNum: ACTIVOS }),
      account({ accountCode: '111', fatherNum: '110', levels: 3 }),
      account({ accountCode: '120', fatherNum: ACTIVOS }),
    ]
    const tree = buildAccountTree(accounts, ACTIVOS)
    expect([...collectAccountCodes(tree)].sort()).toEqual(['110', '111', '120'])
  })

  it('devuelve un conjunto vacío para un árbol vacío', () => {
    expect(collectAccountCodes([]).size).toBe(0)
  })
})
