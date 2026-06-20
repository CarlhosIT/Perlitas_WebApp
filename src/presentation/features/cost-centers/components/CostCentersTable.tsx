import { Badge } from '@/presentation/components/ui/badge'
import { DataTable } from '@/presentation/components/shared/DataTable/DataTable'
import type { CostCenter } from '@/domain/finance/CostCenter.types'
import type { ColumnDef } from '@/presentation/components/shared/DataTable/DataTable.types'

const columns: ColumnDef<CostCenter>[] = [
  { header: 'Código', accessorKey: 'code' },
  { header: 'Nombre', accessorKey: 'name' },
  {
    header: 'Estado',
    accessorKey: 'active',
    cell: (value) => (
      <Badge variant={value === 'S' ? 'default' : 'secondary'}>
        {value === 'S' ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    header: 'Bloqueado',
    accessorKey: 'locked',
    cell: (value) => (
      <Badge variant={value === 'S' ? 'destructive' : 'outline'}>
        {value === 'S' ? 'Sí' : 'No'}
      </Badge>
    ),
  },
  { header: 'Dim. Código', accessorKey: 'dimCode' },
]

interface CostCentersTableProps {
  data: CostCenter[]
  totalRecords: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onFilterChange: (filter: string) => void
}

export function CostCentersTable({
  data, totalRecords, currentPage, pageSize,
  isLoading, onPageChange, onFilterChange,
}: CostCentersTableProps) {
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
