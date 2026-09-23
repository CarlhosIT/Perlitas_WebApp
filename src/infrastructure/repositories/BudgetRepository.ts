import type { IBudgetRepository } from '@/domain/budget/IBudgetRepository'
import type {
  BudgetScenario,
  CreateScenarioCommand,
  UpdateScenarioCommand,
} from '@/domain/budget/BudgetScenario.types'
import type { HttpResponse, PageWrapper } from '@/domain/shared/HttpResponse.types'
import type { BudgetUploadJob } from '@/domain/budget/BudgetUploadJob.types'
import { apiClient } from '../http/apiClient'

// El API a veces envuelve valores decimales como { source, parsedValue } en vez de un número plano
type RawInitRate = number | { source: string; parsedValue: number } | null

type RawBudgetScenario = Omit<BudgetScenario, 'initRate'> & { initRate: RawInitRate }

function normalizeInitRate(raw: RawInitRate): number | null {
  if (raw == null) return null
  return typeof raw === 'number' ? raw : raw.parsedValue
}

function mapScenario(raw: RawBudgetScenario): BudgetScenario {
  return { ...raw, initRate: normalizeInitRate(raw.initRate) }
}

class BudgetRepositoryImpl implements IBudgetRepository {
  async getAll(filter?: string): Promise<BudgetScenario[]> {
    const { data } = await apiClient.get<HttpResponse<PageWrapper<RawBudgetScenario>>>('/Budget/scenarios', {
      params: { Filter: filter },
    })
    return (data.data?.data ?? []).map(mapScenario)
  }

  async getById(id: number): Promise<BudgetScenario> {
    const { data } = await apiClient.get<HttpResponse<RawBudgetScenario>>(`/Budget/scenarios/${id}`)
    return mapScenario(data.data)
  }

  async create(command: CreateScenarioCommand): Promise<BudgetScenario> {
    const { data } = await apiClient.post<HttpResponse<RawBudgetScenario>>('/Budget/scenarios', command)
    return mapScenario(data.data)
  }

  async update(id: number, command: UpdateScenarioCommand): Promise<void> {
    await apiClient.put(`/Budget/scenarios/${id}`, command)
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/Budget/scenarios/${id}`)
  }

  async uploadLines(id: number, file: File): Promise<BudgetUploadJob> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<HttpResponse<BudgetUploadJob>>(`/Budget/scenarios/${id}/lines/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  }

  async getScenarioJobs(id: number): Promise<BudgetUploadJob[]> {
    const { data } = await apiClient.get<HttpResponse<BudgetUploadJob[]>>(`/Budget/scenarios/${id}/jobs`)
    return data.data ?? []
  }

  async downloadTemplate(id: number): Promise<Blob> {
    const { data } = await apiClient.get(`/Budget/scenarios/${id}/template`, {
      responseType: 'blob',
    })
    return data
  }
}

export const budgetRepository = new BudgetRepositoryImpl()
