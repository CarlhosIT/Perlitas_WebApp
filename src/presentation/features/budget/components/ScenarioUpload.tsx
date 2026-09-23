import { useRef } from 'react'
import { Upload, Download, Info } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'

interface ScenarioUploadProps {
  onUploadLines: (file: File) => void
  onDownloadTemplate: () => void
  isUploading?: boolean
  isDownloading?: boolean
  error?: string | null
  /** Solo los escenarios con centro de costos de la dimensión 4 admiten carga */
  canUploadLines: boolean
  /** Mientras se comprueba, no se muestra ni el botón ni el aviso */
  isCheckingUploadPermission?: boolean
}

export function ScenarioUpload({
  onUploadLines, onDownloadTemplate,
  isUploading, isDownloading, error,
  canUploadLines, isCheckingUploadPermission,
}: ScenarioUploadProps) {
  const linesRef = useRef<HTMLInputElement>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Carga de Excel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <p className="text-sm font-medium">Plantilla Excel</p>
            <p className="text-xs text-muted-foreground">Descarga la plantilla para llenar las líneas</p>
          </div>
          <Button variant="outline" size="sm" onClick={onDownloadTemplate} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Descargando...' : 'Descargar'}
          </Button>
        </div>

        {isCheckingUploadPermission && (
          <p className="text-xs text-muted-foreground px-3">
            Comprobando si este escenario admite carga de líneas...
          </p>
        )}

        {!isCheckingUploadPermission && canUploadLines && (
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="text-sm font-medium">Cargar Líneas del Escenario</p>
              <p className="text-xs text-muted-foreground">Sube el Excel con las líneas de este escenario</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => linesRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Subiendo...' : 'Subir'}
            </Button>
            <input
              ref={linesRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onUploadLines(f)
                e.target.value = ''
              }}
            />
          </div>
        )}

        {!isCheckingUploadPermission && !canUploadLines && (
          <div className="flex gap-2 p-3 border rounded-md bg-muted/40">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Este escenario no admite carga de líneas. Solo pueden cargarse en escenarios
              con un centro de costos de dimensión 4.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
