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
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

const scenarioSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  initRate: z
    .string()
    .min(1, 'El ratio es requerido')
    .refine((v) => !isNaN(Number(v.trim())) && v.trim() !== '', 'Debe ser un número')
    .refine((v) => Number(v.trim()) >= 0, 'Mínimo 0')
    .refine((v) => Number(v.trim()) <= 100, 'Máximo 100'),
  financYear: z.string().min(1, 'La fecha de inicio es requerida'),
  baseId: z.string().optional(),
  ocrCode: z.string().optional(),
})

type ScenarioFormRaw = z.infer<typeof scenarioSchema>

export interface ScenarioFormValues {
  name: string
  initRate: number
  financYear: string
  baseId: number | null
  ocrCode: string | null
}

interface ScenarioFormProps {
  defaultValues?: Partial<BudgetScenario>
  scenarios?: BudgetScenario[]
  onSubmit: (values: ScenarioFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ScenarioForm({
  defaultValues,
  scenarios,
  onSubmit,
  onCancel,
  isLoading,
}: ScenarioFormProps) {
  const form = useForm<ScenarioFormRaw>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      initRate: String(defaultValues?.initRate ?? 0),
      financYear: defaultValues?.financYear
        ? defaultValues.financYear.substring(0, 10)
        : '',
      baseId: defaultValues?.baseId != null ? String(defaultValues.baseId) : '',
      ocrCode: defaultValues?.ocrCode ?? '',
    },
  })

  function handleValidSubmit(raw: ScenarioFormRaw) {
    onSubmit({
      name: raw.name,
      initRate: Number(raw.initRate.trim()),
      financYear: raw.financYear,
      baseId: raw.baseId ? Number(raw.baseId) : null,
      ocrCode: raw.ocrCode?.trim() || null,
    })
  }

  const availableBases = scenarios?.filter(
    (s) => s.absId !== defaultValues?.absId
  ) ?? []

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
              <Input type="number" step="0.01" min="0" max="100" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="financYear" render={({ field }) => (
          <FormItem>
            <FormLabel>Inicio Año Fiscal</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="baseId" render={({ field }) => (
          <FormItem>
            <FormLabel>Escenario Base (opcional)</FormLabel>
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sin escenario base" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Sin escenario base</SelectItem>
                {availableBases.map((s) => (
                  <SelectItem key={s.absId} value={String(s.absId)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="ocrCode" render={({ field }) => (
          <FormItem>
            <FormLabel>Código OCR (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="OCR-001" {...field} />
            </FormControl>
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
