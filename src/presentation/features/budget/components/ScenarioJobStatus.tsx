import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { BudgetUploadJobStatus } from '@/domain/budget/BudgetUploadJob.types'
import type { BudgetUploadJob } from '@/domain/budget/BudgetUploadJob.types'

const STATUS_LABEL: Record<BudgetUploadJobStatus, string> = {
  [BudgetUploadJobStatus.Queued]: 'En cola',
  [BudgetUploadJobStatus.Running]: 'Procesando',
  [BudgetUploadJobStatus.Completed]: 'Completado',
  [BudgetUploadJobStatus.Failed]: 'Fallido',
}

interface ScenarioJobStatusProps {
  job: BudgetUploadJob | undefined
  isLoading: boolean
}

export function ScenarioJobStatus({ job, isLoading }: ScenarioJobStatusProps) {
  if (isLoading || !job) return null

  const percent = job.totalLines > 0
    ? Math.round((job.processedLines / job.totalLines) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Última carga de líneas
          {job.status === BudgetUploadJobStatus.Queued && (
            <Badge variant="secondary">{STATUS_LABEL[job.status]}</Badge>
          )}
          {job.status === BudgetUploadJobStatus.Running && (
            <Badge className="animate-pulse">{STATUS_LABEL[job.status]}</Badge>
          )}
          {job.status === BudgetUploadJobStatus.Completed && (
            <Badge className="border-transparent bg-green-600 text-white hover:bg-green-600">
              {STATUS_LABEL[job.status]}
            </Badge>
          )}
          {job.status === BudgetUploadJobStatus.Failed && (
            <Badge variant="destructive">{STATUS_LABEL[job.status]}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{job.processedLines} de {job.totalLines} líneas</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {job.status === BudgetUploadJobStatus.Failed && job.errors && job.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-1">
                {job.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
