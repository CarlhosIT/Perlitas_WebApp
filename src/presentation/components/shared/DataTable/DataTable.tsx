import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/presentation/components/ui/table'
import type { DataTableProps } from './DataTable.types'

export function DataTable<T extends Record<string, unknown>>({
  columns, data, totalRecords, currentPage, pageSize,
  onPageChange, onFilterChange, isLoading,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalRecords / pageSize)

  return (
    <div className="space-y-4">
      {onFilterChange && (
        <Input
          placeholder="Buscar..."
          onChange={(e) => onFilterChange(e.target.value)}
          className="max-w-sm"
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.accessorKey)}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Sin resultados
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.accessorKey)}>
                      {col.cell
                        ? col.cell(row[col.accessorKey], row)
                        : String(row[col.accessorKey] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalRecords} registros en total</span>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline" size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
