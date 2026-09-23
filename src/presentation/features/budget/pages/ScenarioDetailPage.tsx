import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog/ConfirmDialog'
import { ScenarioUpload } from '../components/ScenarioUpload'
import { ScenarioJobStatus } from '../components/ScenarioJobStatus'
import { costCenterByCodeFilter } from '../utils/costCenterFilters'
import {
  useGetScenario, useUploadLines,
  useDownloadTemplate, useScenarioJobs, getLatestJob,
} from '@/core/budget'
import { useCostCenters } from '@/core/finance'

export function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scenarioId = Number(id)
  const isValidId = !isNaN(scenarioId) && scenarioId > 0

  const { data: scenario, isLoading, error } = useGetScenario(isValidId ? scenarioId : 0)
  const uploadLinesMutation = useUploadLines(scenarioId)
  const downloadMutation = useDownloadTemplate(scenarioId)
  const { data: jobs, isLoading: isJobsLoading } = useScenarioJobs(isValidId ? scenarioId : 0)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // Solo admiten carga de líneas los escenarios cuyo centro de costos es de la
  // dimensión 4: los escenarios raíz no tienen centro, así que quedan fuera.
  const ocrCode = scenario?.ocrCode ?? ''
  const dimensionQuery = useCostCenters(
    {
      pageNumber: 1,
      pageSize: 10,
      filter: ocrCode !== '' ? costCenterByCodeFilter(ocrCode) : undefined,
    },
    { enabled: ocrCode !== '' }
  )
  const isCheckingDimension = ocrCode !== '' && dimensionQuery.isLoading
  const canUploadLines =
    ocrCode !== '' && (dimensionQuery.data?.data?.length ?? 0) > 0

  const uploadError =
    (uploadLinesMutation.error as Error | null)?.message ??
    (downloadMutation.error as Error | null)?.message ??
    (dimensionQuery.error as Error | null)?.message ??
    null

  function handleUploadRequest(file: File) {
    if (scenario && scenario.initRate != null && scenario.initRate !== 100) {
      setPendingFile(file)
    } else {
      uploadLinesMutation.mutate(file)
    }
  }

  function confirmUpload() {
    if (!pendingFile) return
    uploadLinesMutation.mutate(pendingFile)
    setPendingFile(null)
  }

  if (!isValidId) {
    return <Navigate to="/scenarios" replace />
  }

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
              <Badge variant="secondary">#{scenario.absId}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ratio Inicial</dt>
                <dd className="font-medium">{scenario.initRate ?? 0}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Inicio Año Fiscal</dt>
                <dd className="font-medium">
                  {new Date(scenario.financYear).toLocaleDateString('es-ES')}
                </dd>
              </div>
              {scenario.baseId != null && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Escenario Base</dt>
                  <dd className="font-medium">#{scenario.baseId}</dd>
                </div>
              )}
              {scenario.ocrCode && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Centro de Costos</dt>
                  <dd className="font-medium">{scenario.ocrCode}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ScenarioUpload
            onUploadLines={handleUploadRequest}
            onDownloadTemplate={() => downloadMutation.mutate()}
            isUploading={uploadLinesMutation.isPending}
            isDownloading={downloadMutation.isPending}
            error={uploadError}
            canUploadLines={canUploadLines}
            isCheckingUploadPermission={isCheckingDimension}
          />
          <ScenarioJobStatus job={getLatestJob(jobs)} isLoading={isJobsLoading} />
        </div>
      </div>

      <ConfirmDialog
        open={pendingFile != null}
        variant="default"
        title="Ratio inicial distinto de 100%"
        description={`Este escenario tiene un ratio inicial del ${scenario.initRate}%. Los valores que subas quedarán al ${scenario.initRate}% de lo que contiene el Excel. ¿Seguro que quieres continuar?`}
        confirmLabel="Sí, continuar"
        loadingLabel="Subiendo..."
        onConfirm={confirmUpload}
        onCancel={() => setPendingFile(null)}
        isLoading={uploadLinesMutation.isPending}
      />
    </div>
  )
}
