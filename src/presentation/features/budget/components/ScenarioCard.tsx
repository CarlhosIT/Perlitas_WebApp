import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'
import type { ScenarioTreeNode } from '../utils/buildScenarioTree'

interface ScenarioCardProps {
  scenario: ScenarioTreeNode
  onEdit: (scenario: BudgetScenario) => void
  onDelete: (scenario: BudgetScenario) => void
}

export function ScenarioCard({ scenario, onEdit, onDelete }: ScenarioCardProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const hasChildren = scenario.children.length > 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? 'Colapsar hijos' : 'Desplegar hijos'}
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            <CardTitle className="text-base truncate">{scenario.name}</CardTitle>
          </div>
          <Badge variant="secondary">#{scenario.absId}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span>Ratio inicial:</span>
          <span className="font-medium text-foreground">{scenario.initRate ?? 0}%</span>
          <span>Año fiscal:</span>
          <span className="font-medium text-foreground">
            {new Date(scenario.financYear).toLocaleDateString('es-ES')}
          </span>
          {scenario.baseId != null && (
            <>
              <span>Escenario base:</span>
              <span className="font-medium text-foreground">#{scenario.baseId}</span>
            </>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => navigate(`/scenarios/${scenario.absId}`)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> Ver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(scenario)}>
            <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(scenario)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar
          </Button>
        </div>

        {hasChildren && expanded && (
          <div className="space-y-3 pt-1 pl-3 border-l">
            {scenario.children.map((child) => (
              <ScenarioCard
                key={child.absId}
                scenario={child}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
