import { useRef } from 'react'
import { Upload, Download } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'

interface ScenarioUploadProps {
  onUploadLines: (file: File) => void
  onImportBudget: (file: File) => void
  onDownloadTemplate: () => void
  isUploading?: boolean
  isImporting?: boolean
  isDownloading?: boolean
  error?: string | null
}

export function ScenarioUpload({
  onUploadLines, onImportBudget, onDownloadTemplate,
  isUploading, isImporting, isDownloading, error,
}: ScenarioUploadProps) {
  const linesRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

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

        <div className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <p className="text-sm font-medium">Importar Presupuesto Completo</p>
            <p className="text-xs text-muted-foreground">Importa un presupuesto completo desde Excel</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => importRef.current?.click()} disabled={isImporting}>
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importando...' : 'Importar'}
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportBudget(f)
              e.target.value = ''
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
