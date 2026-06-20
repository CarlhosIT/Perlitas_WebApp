import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { ScenarioUpload } from '../components/ScenarioUpload'
import {
  useGetScenario, useUploadLines,
  useImportBudget, useDownloadTemplate,
} from '@/core/budget'

export function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scenarioId = Number(id)

  const { data: scenario, isLoading, error } = useGetScenario(scenarioId)
  const uploadLinesMutation = useUploadLines(scenarioId)
  const importMutation = useImportBudget()
  const downloadMutation = useDownloadTemplate()

  const uploadError =
    (uploadLinesMutation.error as Error | null)?.message ??
    (importMutation.error as Error | null)?.message ??
    null

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    )
  }

  if (!scenario) return null

  return (
    <div>
      <PageHeader
        title={scenario.name}
        description="Detalle del escenario de presupuesto"
        actions={
          <Button variant="outline" onClick={() => navigate('/scenarios')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Información del Escenario
              <Badge variant="secondary">#{scenario.numerator}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ratio Inicial</dt>
                <dd className="font-medium">{scenario.initialRatioPercentage}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ratio Adicional</dt>
                <dd className="font-medium">{scenario.additionalRatioPercentage}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Inicio Año Fiscal</dt>
                <dd className="font-medium">
                  {new Date(scenario.startOfFiscalYear).toLocaleDateString('es-ES')}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <ScenarioUpload
          onUploadLines={(file) => uploadLinesMutation.mutate(file)}
          onImportBudget={(file) => importMutation.mutate(file)}
          onDownloadTemplate={() => downloadMutation.mutate()}
          isUploading={uploadLinesMutation.isPending}
          isImporting={importMutation.isPending}
          isDownloading={downloadMutation.isPending}
          error={uploadError}
        />
      </div>
    </div>
  )
}
