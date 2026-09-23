/**
 * Páginas que faltan por pedir después de la primera.
 *
 * El tamaño de página real lo impone el servidor (recorta lo que se le pida),
 * así que se deduce de cuántas filas devolvió la primera página en vez de
 * asumir el PageSize solicitado.
 */
export function remainingPageNumbers(
  totalRecords: number,
  firstPageLength: number,
  maxPages: number
): number[] {
  if (firstPageLength <= 0) return []
  if (totalRecords <= firstPageLength) return []

  const totalPages = Math.min(Math.ceil(totalRecords / firstPageLength), maxPages)
  return Array.from({ length: totalPages - 1 }, (_, index) => index + 2)
}
