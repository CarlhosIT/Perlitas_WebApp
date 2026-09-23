/** Dimensión de centros de costos que usa el presupuesto */
export const COST_CENTER_DIM_CODE = 4

/** Todos los centros de costos de esa dimensión */
export const COST_CENTER_DIM_FILTER = `DimCode==${COST_CENTER_DIM_CODE}`

/**
 * Un centro de costos concreto dentro de esa dimensión. Sirve para comprobar
 * si el centro de un escenario pertenece a la dimensión que admite carga de
 * líneas, sin depender de que el centro entre en una lista paginada.
 */
export function costCenterByCodeFilter(code: string): string {
  const escaped = code.replace(/"/g, '\\"')
  return `DimCode==${COST_CENTER_DIM_CODE} and Code=="${escaped}"`
}
