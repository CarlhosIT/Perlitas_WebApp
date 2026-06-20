import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from '@/presentation/components/ui/form'
import type { BudgetScenario } from '@/domain/budget/BudgetScenario.types'

// Use string-based numeric fields to avoid Zod v4 z.coerce input-type mismatch with RHF v7
const scenarioSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  initialRatioPercentage: z
    .string()
    .min(1, 'El ratio inicial es requerido')
    .refine((v) => !isNaN(Number(v)), 'Debe ser un número')
    .refine((v) => Number(v) >= 0, 'Mínimo 0')
    .refine((v) => Number(v) <= 100, 'Máximo 100'),
  additionalRatioPercentage: z
    .string()
    .min(1, 'El ratio adicional es requerido')
    .refine((v) => !isNaN(Number(v)), 'Debe ser un número')
    .refine((v) => Number(v) >= 0, 'Mínimo 0')
    .refine((v) => Number(v) <= 100, 'Máximo 100'),
  startOfFiscalYear: z.string().min(1, 'La fecha de inicio es requerida'),
})

type ScenarioFormRaw = z.infer<typeof scenarioSchema>

export interface ScenarioFormValues {
  name: string
  initialRatioPercentage: number
  additionalRatioPercentage: number
  startOfFiscalYear: string
}

interface ScenarioFormProps {
  defaultValues?: Partial<BudgetScenario>
  onSubmit: (values: ScenarioFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ScenarioForm({ defaultValues, onSubmit, onCancel, isLoading }: ScenarioFormProps) {
  const form = useForm<ScenarioFormRaw>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      initialRatioPercentage: String(defaultValues?.initialRatioPercentage ?? 0),
      additionalRatioPercentage: String(defaultValues?.additionalRatioPercentage ?? 0),
      startOfFiscalYear: defaultValues?.startOfFiscalYear
        ? defaultValues.startOfFiscalYear.substring(0, 10)
        : '',
    },
  })

  function handleValidSubmit(raw: ScenarioFormRaw) {
    onSubmit({
      name: raw.name,
      initialRatioPercentage: Number(raw.initialRatioPercentage),
      additionalRatioPercentage: Number(raw.additionalRatioPercentage),
      startOfFiscalYear: raw.startOfFiscalYear,
    })
  }

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
        <FormField control={form.control} name="initialRatioPercentage" render={({ field }) => (
          <FormItem>
            <FormLabel>Ratio Inicial (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="additionalRatioPercentage" render={({ field }) => (
          <FormItem>
            <FormLabel>Ratio Adicional (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="startOfFiscalYear" render={({ field }) => (
          <FormItem>
            <FormLabel>Inicio Año Fiscal</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
