import type { ReactNode } from 'react'

export interface ColumnDef<T> {
  header: string
  accessorKey: keyof T
  cell?: (value: T[keyof T], row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  totalRecords: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onFilterChange?: (filter: string) => void
  isLoading?: boolean
}
