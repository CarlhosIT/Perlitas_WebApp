import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/presentation/components/ui/table'
import { useUpdateAccountBudgetFlag } from '@/core/finance'
import type { AccountTreeNode } from '../utils/buildAccountTree'

const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })

function BudgetFlagCell({ accountCode, value }: { accountCode: string; value: boolean }) {
  const mutation = useUpdateAccountBudgetFlag()

  return (
    <Button
      size="sm"
      variant={value ? 'default' : 'outline'}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ accountCode, budget: !value })}
    >
      {value ? 'Activo' : 'Inactivo'}
    </Button>
  )
}

interface VisibleRow {
  node: AccountTreeNode
  depth: number
}

function flattenVisible(
  nodes: AccountTreeNode[],
  depth: number,
  expandedIds: Set<string>
): VisibleRow[] {
  return nodes.flatMap((node) => {
    const row: VisibleRow = { node, depth }
    const isExpanded = node.accountCode != null && expandedIds.has(node.accountCode)
    if (node.children.length > 0 && isExpanded) {
      return [row, ...flattenVisible(node.children, depth + 1, expandedIds)]
    }
    return [row]
  })
}

interface AccountsTableProps {
  nodes: AccountTreeNode[]
  isLoading: boolean
  emptyMessage: string
  initialExpandedIds?: Set<string>
}

export function AccountsTable({
  nodes, isLoading, emptyMessage, initialExpandedIds,
}: AccountsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialExpandedIds)
  )

  function toggleExpanded(accountCode: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(accountCode)) next.delete(accountCode)
      else next.add(accountCode)
      return next
    })
  }

  const rows = flattenVisible(nodes, 0, expandedIds)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Código Formato</TableHead>
            <TableHead>Total Actual</TableHead>
            <TableHead>Presupuesto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Cargando...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {!isLoading && rows.map(({ node, depth }) => {
            const hasChildren = node.children.length > 0
            const expanded = node.accountCode != null && expandedIds.has(node.accountCode)
            return (
              <TableRow key={node.accountCode ?? `${depth}-${node.accountName}`}>
                <TableCell>
                  <div
                    className="flex items-center gap-1"
                    style={{ paddingLeft: `${depth * 1.5}rem` }}
                  >
                    {hasChildren && node.accountCode != null ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => toggleExpanded(node.accountCode as string)}
                        aria-label={expanded ? 'Colapsar cuentas hijas' : 'Desplegar cuentas hijas'}
                      >
                        {expanded
                          ? <ChevronDown className="h-4 w-4" />
                          : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    ) : (
                      <span className="w-6 shrink-0" />
                    )}
                    <span className={hasChildren ? 'font-medium' : undefined}>
                      {node.accountName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{node.levels}</TableCell>
                <TableCell>{node.formatCode ?? '—'}</TableCell>
                <TableCell className="tabular-nums">{currency.format(node.currTotal)}</TableCell>
                <TableCell>
                  {node.accountCode ? (
                    <BudgetFlagCell accountCode={node.accountCode} value={node.budget === 'Y'} />
                  ) : null}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
