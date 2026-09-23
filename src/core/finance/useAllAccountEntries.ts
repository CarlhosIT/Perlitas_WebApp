import { useQuery } from '@tanstack/react-query'
import { financeRepository } from '@/infrastructure/repositories/FinanceRepository'

interface UseAllAccountEntriesOptions {
  enabled?: boolean
}

/**
 * Trae todas las cuentas que cumplen el filtro, recorriendo las páginas que
 * haga falta. Para el árbol, que necesita la rama completa de una vez.
 */
export function useAllAccountEntries(
  filter: string | undefined,
  options?: UseAllAccountEntriesOptions
) {
  return useQuery({
    queryKey: ['allAccountEntries', filter],
    queryFn: () => financeRepository.getAllAccountEntries(filter),
    enabled: options?.enabled ?? true,
  })
}
