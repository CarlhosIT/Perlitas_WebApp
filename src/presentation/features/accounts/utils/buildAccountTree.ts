import type { AccountingEntry } from '@/domain/finance/AccountingEntry.types'

export interface AccountTreeNode extends AccountingEntry {
  children: AccountTreeNode[]
}

function byAccountCode(a: AccountingEntry, b: AccountingEntry): number {
  return (a.accountCode ?? '').localeCompare(b.accountCode ?? '')
}

/**
 * Arma el árbol de cuentas colgando de `rootFatherNum`: las raíces son las
 * cuentas cuyo `fatherNum` es ese código, y debajo se anidan sus descendientes.
 * Las cuentas que no cuelgan de esa raíz quedan fuera del resultado.
 */
export function buildAccountTree(
  accounts: AccountingEntry[],
  rootFatherNum: string | null
): AccountTreeNode[] {
  const childrenByFather = new Map<string, AccountingEntry[]>()
  accounts.forEach((account) => {
    const key = account.fatherNum ?? ''
    const siblings = childrenByFather.get(key)
    if (siblings) siblings.push(account)
    else childrenByFather.set(key, [account])
  })

  // corta ciclos y cuentas repetidas: una cuenta se coloca una sola vez
  const placed = new Set<string>()

  function build(fatherKey: string): AccountTreeNode[] {
    const children = childrenByFather.get(fatherKey) ?? []
    return children
      .filter((account) => {
        if (account.accountCode == null) return true
        if (placed.has(account.accountCode)) return false
        placed.add(account.accountCode)
        return true
      })
      .sort(byAccountCode)
      .map((account) => ({
        ...account,
        children: account.accountCode == null ? [] : build(account.accountCode),
      }))
  }

  return build(rootFatherNum ?? '')
}

/** Códigos de todas las cuentas del árbol, para desplegarlo por completo. */
export function collectAccountCodes(nodes: AccountTreeNode[]): Set<string> {
  const codes = new Set<string>()
  function walk(list: AccountTreeNode[]) {
    list.forEach((node) => {
      if (node.accountCode != null) codes.add(node.accountCode)
      walk(node.children)
    })
  }
  walk(nodes)
  return codes
}
