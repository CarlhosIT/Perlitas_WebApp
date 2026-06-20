import type { AccountingEntry } from './AccountingEntry.types'
import type { CostCenter } from './CostCenter.types'
import type { PageParams, PageWrapper } from '../shared/HttpResponse.types'

export interface IFinanceRepository {
  getAccountEntries(params: PageParams): Promise<PageWrapper<AccountingEntry>>
  getCostCenters(params: PageParams): Promise<PageWrapper<CostCenter>>
}
