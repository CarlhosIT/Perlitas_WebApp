import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog/ConfirmDialog'
import { ScenarioTable } from '../components/ScenarioTable'
import { ScenarioForm } from '../components/ScenarioForm'
import type { ScenarioFormValues } from '../components/ScenarioForm'
import { buildScenarioTree } from '../utils/buildScenarioTree'
import { CURRENT_YEAR, YEAR_OPTIONS } from '../utils/yearOptions'
import {
  useGetScenarios, useCreateScenario,
  useUpdateScenario, useDeleteScenario,
} from '@/core/budget'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

export function ScenariosPage() {
  const [year, setYear] = useState(CURRENT_YEAR)
  const { data: scenarios, isLoading, error } = useGetScenarios(year)
  const createMutation = useCreateScenario()
  const deleteMutation = useDeleteScenario()

  const scenarioTree = useMemo(() => buildScenarioTree(scenarios ?? []), [scenarios])

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BudgetScenario | null>(null)
  const [createParent, setCreateParent] = useState<BudgetScenario | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BudgetScenario | null>(null)

  const updateMutation = useUpdateScenario(editTarget?.absId ?? 0)

  function handleSubmit(values: ScenarioFormValues) {
    if (editTarget) {
      updateMutation.mutate(
        { ...values, absId: editTarget.absId },
        { onSuccess: () => { setFormOpen(false); setEditTarget(null) } }
      )
    } else {
      createMutation.mutate(
        { ...values, baseId: createParent?.absId ?? null },
        { onSuccess: () => { setFormOpen(false); setCreateParent(null) } }
      )
    }
  }

  function handleCreateRoot() {
    setEditTarget(null)
    setCreateParent(null)
    setFormOpen(true)
  }

  function handleCreateChild(parent: BudgetScenario) {
    setEditTarget(null)
    setCreateParent(parent)
    setFormOpen(true)
  }

  function handleEdit(scenario: BudgetScenario) {
    setEditTarget(scenario)
    setFormOpen(true)
  }

  function handleDelete(scenario: BudgetScenario) {
    setDeleteTarget(scenario)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.absId, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const dialogTitle = editTarget
    ? 'Editar Escenario'
    : createParent
      ? `Nuevo Sub-Escenario de "${createParent.name}"`
      : 'Nuevo Escenario'

  return (
    <div>
      <PageHeader
        title="Escenarios de Presupuesto"
        description="Gestiona los escenarios para la planificación financiera"
        actions={
          <div className="flex items-center gap-2">
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreateRoot}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Escenario
            </Button>
          </div>
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Cargando escenarios...</p>
      ) : (
        <ScenarioTable
          scenarios={scenarioTree}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateChild={handleCreateChild}
        />
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(v) => { if (!v) { setFormOpen(false); setEditTarget(null); setCreateParent(null) } }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          {(createMutation.error || updateMutation.error) && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>
                {((createMutation.error ?? updateMutation.error) as Error).message}
              </AlertDescription>
            </Alert>
          )}
          <ScenarioForm
            defaultValues={editTarget ?? undefined}
            parentYear={createParent ? new Date(createParent.financYear).getFullYear() : undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setFormOpen(false); setEditTarget(null); setCreateParent(null) }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar Escenario"
        description={`¿Estás seguro de eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
      {deleteMutation.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {(deleteMutation.error as Error).message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
