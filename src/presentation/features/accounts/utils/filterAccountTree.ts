import type { AccountTreeNode } from './buildAccountTree'

/** Minúsculas y sin tildes, para que "credito" encuentre "Crédito". */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/**
 * Filtra el árbol por nombre o código de formato, conservando la jerarquía:
 * una cuenta se mantiene si coincide (con todo su subárbol, para poder seguir
 * explorándola) o si alguna de sus descendientes coincide.
 */
export function filterAccountTree(
  nodes: AccountTreeNode[],
  text: string
): AccountTreeNode[] {
  const needle = normalize(text.trim())
  if (needle === '') return nodes

  function matches(node: AccountTreeNode): boolean {
    return (
      normalize(node.accountName ?? '').includes(needle) ||
      normalize(node.formatCode ?? '').includes(needle)
    )
  }

  function walk(list: AccountTreeNode[]): AccountTreeNode[] {
    const kept: AccountTreeNode[] = []
    list.forEach((node) => {
      if (matches(node)) {
        kept.push(node)
        return
      }
      const children = walk(node.children)
      if (children.length > 0) kept.push({ ...node, children })
    })
    return kept
  }

  return walk(nodes)
}
