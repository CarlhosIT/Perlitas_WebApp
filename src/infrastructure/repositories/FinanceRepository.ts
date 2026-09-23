import type { IFinanceRepository } from '@/domain/finance/IFinanceRepository'
import type { AccountingEntry, AccountEntriesResult } from '@/domain/finance/AccountingEntry.types'
import type { CostCenter } from '@/domain/finance/CostCenter.types'
import type { PageParams, PageWrapper } from '@/domain/shared/HttpResponse.types'
import { apiClient } from '../http/apiClient'
import { remainingPageNumbers } from './pagination'

/** El servidor recorta el tamaño de página a 250 aunque se le pida más */
const MAX_PAGE_SIZE = 250
/** Tope de seguridad para no encadenar peticiones sin fin */
const MAX_PAGES = 40

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

  async getAllAccountEntries(filter?: string): Promise<AccountEntriesResult> {
    const first = await this.getAccountEntries({
      pageNumber: 1,
      pageSize: MAX_PAGE_SIZE,
      filter,
    })

    const accounts = [...(first.data ?? [])]
    const totalRecords = first.totalRecords ?? accounts.length

    const pending = remainingPageNumbers(totalRecords, accounts.length, MAX_PAGES)
    if (pending.length > 0) {
      const pages = await Promise.all(
        pending.map((pageNumber) =>
          this.getAccountEntries({ pageNumber, pageSize: MAX_PAGE_SIZE, filter })
        )
      )
      pages.forEach((page) => accounts.push(...(page.data ?? [])))
    }

    return { accounts, totalRecords }
  }

  async updateAccountBudgetFlag(accountCode: string, budget: boolean): Promise<void> {
    await apiClient.put(`/Finance/AccountEntries/${accountCode}/budget`, { accountCode, budget })
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
