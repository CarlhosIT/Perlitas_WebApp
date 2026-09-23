import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from '@/presentation/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'
import { useCostCenters } from '@/core/finance'
import { CURRENT_YEAR, YEAR_OPTIONS } from '../utils/yearOptions'
import { COST_CENTER_DIM_FILTER } from '../utils/costCenterFilters'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'


const scenarioSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  initRate: z
    .string()
    .min(1, 'El ratio es requerido')
    .refine((v) => !isNaN(Number(v.trim())) && v.trim() !== '', 'Debe ser un número')
    .refine((v) => Number(v.trim()) >= 0, 'Mínimo 0'),
  financYear: z.string().min(1, 'El año fiscal es requerido'),
  ocrCode: z.string().optional(),
})

type ScenarioFormRaw = z.infer<typeof scenarioSchema>

export interface ScenarioFormValues {
  name: string
  initRate: number
  financYear: number
  ocrCode: string | null
}

interface ScenarioFormProps {
  defaultValues?: Partial<BudgetScenario>
  parentYear?: number
  onSubmit: (values: ScenarioFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ScenarioForm({
  defaultValues,
  parentYear,
  onSubmit,
  onCancel,
  isLoading,
}: ScenarioFormProps) {
  const form = useForm<ScenarioFormRaw>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      initRate: String(defaultValues?.initRate ?? 0),
      financYear: parentYear != null
        ? String(parentYear)
        : defaultValues?.financYear
          ? String(new Date(defaultValues.financYear).getFullYear())
          : String(CURRENT_YEAR),
      ocrCode: defaultValues?.ocrCode ?? '',
    },
  })

  function handleValidSubmit(raw: ScenarioFormRaw) {
    onSubmit({
      name: raw.name,
      initRate: Number(raw.initRate.trim()),
      financYear: Number(raw.financYear),
      ocrCode: raw.ocrCode || null,
    })
  }

  const { data: costCentersPage } = useCostCenters({
    pageNumber: 1,
    pageSize: 500,
    filter: COST_CENTER_DIM_FILTER,
  })
  const costCenters = (costCentersPage?.data ?? []).filter((cc) => cc.code)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Escenario Base 2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="initRate" render={({ field }) => (
          <FormItem>
            <FormLabel>Ratio Inicial (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="financYear" render={({ field }) => (
          <FormItem>
            <FormLabel>
              Año Fiscal
              {parentYear != null && (
                <span className="text-muted-foreground font-normal"> (igual al del escenario base)</span>
              )}
            </FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={parentYear != null}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="ocrCode" render={({ field }) => (
          <FormItem>
            <FormLabel>Centro de Costos (opcional)</FormLabel>
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sin centro de costos" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Sin centro de costos</SelectItem>
                {costCenters.map((cc) => (
                  <SelectItem key={cc.code} value={cc.code as string}>
                    {cc.code} - {cc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
