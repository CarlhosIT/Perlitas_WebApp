import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog/ConfirmDialog'
import { ScenarioCard } from '../components/ScenarioCard'
import { ScenarioForm } from '../components/ScenarioForm'
import type { ScenarioFormValues } from '../components/ScenarioForm'
import {
  useGetScenarios, useCreateScenario,
  useUpdateScenario, useDeleteScenario,
} from '@/core/budget'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

export function ScenariosPage() {
  const { data: scenarios, isLoading, error } = useGetScenarios()
  const createMutation = useCreateScenario()
  const deleteMutation = useDeleteScenario()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BudgetScenario | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BudgetScenario | null>(null)

  const updateMutation = useUpdateScenario(editTarget?.numerator ?? 0)

  function handleSubmit(values: ScenarioFormValues) {
    const isoDate = new Date(values.startOfFiscalYear).toISOString()
    if (editTarget) {
      updateMutation.mutate(
        { ...values, numerator: editTarget.numerator, startOfFiscalYear: isoDate },
        { onSuccess: () => { setFormOpen(false); setEditTarget(null) } }
      )
    } else {
      createMutation.mutate(
        { ...values, startOfFiscalYear: isoDate },
        { onSuccess: () => setFormOpen(false) }
      )
    }
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
    deleteMutation.mutate(deleteTarget.numerator, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div>
      <PageHeader
        title="Escenarios de Presupuesto"
        description="Gestiona los escenarios para la planificación financiera"
        actions={
          <Button onClick={() => { setEditTarget(null); setFormOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Escenario
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(scenarios ?? []).map((s) => (
            <ScenarioCard
              key={s.numerator}
              scenario={s}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {scenarios?.length === 0 && (
            <p className="col-span-full text-muted-foreground">
              No hay escenarios creados aún.
            </p>
          )}
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(v) => { if (!v) { setFormOpen(false); setEditTarget(null) } }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? 'Editar Escenario' : 'Nuevo Escenario'}
            </DialogTitle>
          </DialogHeader>
          <ScenarioForm
            defaultValues={editTarget ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setFormOpen(false); setEditTarget(null) }}
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
    </div>
  )
}
