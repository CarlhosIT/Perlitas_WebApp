import { describe, it, expect } from 'vitest'
import { ROOT_ACCOUNTS_FILTER, branchFilter } from './accountFilters'

describe('filtros de cuentas contables', () => {
  it('el filtro de cuentas raíz pide solo el primer nivel', () => {
    expect(ROOT_ACCOUNTS_FILTER).toBe('Levels==1')
  })

  it('el filtro de rama acota al grupo y excluye su raíz', () => {
    expect(branchFilter(1)).toBe('GroupMask==1 and Levels>=2')
    expect(branchFilter(2)).toBe('GroupMask==2 and Levels>=2')
  })
})
