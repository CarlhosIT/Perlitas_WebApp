import type { IFinanceRepository } from '@/domain/finance/IFinanceRepository'
import type { AccountingEntry } from '@/domain/finance/AccountingEntry.types'
import type { CostCenter } from '@/domain/finance/CostCenter.types'
import type { PageParams, PageWrapper } from '@/domain/shared/HttpResponse.types'
import { apiClient } from '../http/apiClient'

class FinanceRepositoryImpl implements IFinanceRepository {
  async getAccountEntries(params: PageParams): Promise<PageWrapper<AccountingEntry>> {
    const { data } = await apiClient.get<{ data: PageWrapper<AccountingEntry> }>(
      '/Finance/AccountEntries',
      {
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          Filter: params.filter,
        },
      }
    )
    return data.data
  }

  async getCostCenters(params: PageParams): Promise<PageWrapper<CostCenter>> {
    const { data } = await apiClient.get<{ data: PageWrapper<CostCenter> }>(
      '/Finance/CostCenters',
      {
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          Filter: params.filter,
        },
      }
    )
    return data.data
  }
}

export const financeRepository = new FinanceRepositoryImpl()
