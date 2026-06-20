import { useState } from 'react'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { CostCentersTable } from '../components/CostCentersTable'
import { useCostCenters } from '@/core/finance'

const PAGE_SIZE = 20

export function CostCentersPage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')

  const { data, isLoading, error } = useCostCenters({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    filter: filter || undefined,
  })

  return (
    <div>
      <PageHeader
        title="Centros de Costo"
        description="Gestión de centros de costo organizacionales"
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      <CostCentersTable
        data={data?.data ?? []}
        totalRecords={data?.totalRecords ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={setPage}
        onFilterChange={(f) => { setFilter(f); setPage(1) }}
      />
    </div>
  )
}
