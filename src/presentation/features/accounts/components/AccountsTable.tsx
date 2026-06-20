import { DataTable } from '@/presentation/components/shared/DataTable/DataTable'
import type { AccountingEntry } from '@/domain/finance/AccountingEntry.types'
import type { ColumnDef } from '@/presentation/components/shared/DataTable/DataTable.types'

const columns: ColumnDef<AccountingEntry>[] = [
  { header: 'Código', accessorKey: 'accountCode' },
  { header: 'Nombre', accessorKey: 'accountName' },
  { header: 'Código Formato', accessorKey: 'formatCode' },
  {
    header: 'Total Actual',
    accessorKey: 'currTotal',
    cell: (value) =>
      new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(Number(value)),
  },
]

interface AccountsTableProps {
  data: AccountingEntry[]
  totalRecords: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onFilterChange: (filter: string) => void
}

export function AccountsTable({
  data, totalRecords, currentPage, pageSize,
  isLoading, onPageChange, onFilterChange,
}: AccountsTableProps) {
  return (
    <DataTable
      columns={columns as unknown as ColumnDef<Record<string, unknown>>[]}
      data={data as unknown as Record<string, unknown>[]}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onFilterChange={onFilterChange}
      isLoading={isLoading}
    />
  )
}
