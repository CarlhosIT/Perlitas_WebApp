import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

interface ScenarioCardProps {
  scenario: BudgetScenario
  onEdit: (scenario: BudgetScenario) => void
  onDelete: (scenario: BudgetScenario) => void
}

export function ScenarioCard({ scenario, onEdit, onDelete }: ScenarioCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{scenario.name}</CardTitle>
          <Badge variant="secondary">#{scenario.numerator}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span>Ratio inicial:</span>
          <span className="font-medium text-foreground">{scenario.initialRatioPercentage}%</span>
          <span>Ratio adicional:</span>
          <span className="font-medium text-foreground">{scenario.additionalRatioPercentage}%</span>
          <span>Año fiscal:</span>
          <span className="font-medium text-foreground">
            {new Date(scenario.startOfFiscalYear).toLocaleDateString('es-ES')}
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => navigate(`/scenarios/${scenario.numerator}`)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> Ver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(scenario)}>
            <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(scenario)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
