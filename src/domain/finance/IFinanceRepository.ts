import type { AccountingEntry, AccountEntriesResult } from './AccountingEntry.types'
import type { CostCenter } from './CostCenter.types'
import type { PageParams, PageWrapper } from '../shared/HttpResponse.types'

export interface IFinanceRepository {
  getAccountEntries(params: PageParams): Promise<PageWrapper<AccountingEntry>>
  /** Recorre todas las páginas del filtro y devuelve las cuentas completas */
  getAllAccountEntries(filter?: string): Promise<AccountEntriesResult>
  updateAccountBudgetFlag(accountCode: string, budget: boolean): Promise<void>
  getCostCenters(params: PageParams): Promise<PageWrapper<CostCenter>>
}
