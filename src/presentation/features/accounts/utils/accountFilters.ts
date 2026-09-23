/**
 * Filtros del query param `Filter` del endpoint de cuentas contables, que el
 * API evalúa como una expresión tipo lambda sobre la cuenta.
 */

/** Cuentas de primer nivel: Activos, Pasivos, Capital, etc. */
export const ROOT_ACCOUNTS_FILTER = 'Levels==1'

/**
 * Toda la gaveta de un grupo salvo su propia raíz: de aquí salen tanto las
 * opciones de nivel 2 como el árbol completo que cuelga de ellas.
 */
export function branchFilter(groupMask: number): string {
  return `GroupMask==${groupMask} and Levels>=2`
}
