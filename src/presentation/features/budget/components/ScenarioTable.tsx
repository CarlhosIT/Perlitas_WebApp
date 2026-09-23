import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/presentation/components/ui/table'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'
import type { ScenarioTreeNode } from '../utils/buildScenarioTree'

interface VisibleRow {
  node: ScenarioTreeNode
  depth: number
}

function flattenVisible(
  nodes: ScenarioTreeNode[],
  depth: number,
  expandedIds: Set<number>
): VisibleRow[] {
  return nodes.flatMap((node) => {
    const row: VisibleRow = { node, depth }
    if (node.children.length > 0 && expandedIds.has(node.absId)) {
      return [row, ...flattenVisible(node.children, depth + 1, expandedIds)]
    }
    return [row]
  })
}

interface ScenarioTableProps {
  scenarios: ScenarioTreeNode[]
  onEdit: (scenario: BudgetScenario) => void
  onDelete: (scenario: BudgetScenario) => void
  onCreateChild: (parent: BudgetScenario) => void
}

export function ScenarioTable({ scenarios, onEdit, onDelete, onCreateChild }: ScenarioTableProps) {
  const navigate = useNavigate()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  function toggleExpanded(absId: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(absId)) next.delete(absId)
      else next.add(absId)
      return next
    })
  }

  const rows = flattenVisible(scenarios, 0, expandedIds)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ratio Inicial</TableHead>
            <TableHead>Año Fiscal</TableHead>
            <TableHead>Centro de Costos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Sin resultados
              </TableCell>
            </TableRow>
          )}
          {rows.map(({ node, depth }) => {
            const hasChildren = node.children.length > 0
            const expanded = expandedIds.has(node.absId)
            return (
              <TableRow key={node.absId}>
                <TableCell>
                  <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 1.5}rem` }}>
                    {hasChildren ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => toggleExpanded(node.absId)}
                        aria-label={expanded ? 'Colapsar hijos' : 'Desplegar hijos'}
                      >
                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    ) : (
                      <span className="w-6 shrink-0" />
                    )}
                    <span className="font-medium">{node.name}</span>
                    <span className="text-xs text-muted-foreground">#{node.absId}</span>
                  </div>
                </TableCell>
                <TableCell>{node.initRate ?? 0}%</TableCell>
                <TableCell>{new Date(node.financYear).toLocaleDateString('es-ES')}</TableCell>
                <TableCell>{node.ocrCode ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {depth < 2 && (
                      <Button size="icon" variant="ghost" title="Ver" onClick={() => navigate(`/scenarios/${node.absId}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {depth === 0 && (
                      <Button size="icon" variant="ghost" title="Crear sub-escenario" onClick={() => onCreateChild(node)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" title="Editar" onClick={() => onEdit(node)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Eliminar" onClick={() => onDelete(node)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
