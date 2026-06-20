import type { IBudgetRepository } from '@/domain/budget/IBudgetRepository'
import type {
  BudgetScenario,
  CreateScenarioCommand,
  UpdateScenarioCommand,
} from '@/domain/budget/BudgetScenario.types'
import { apiClient } from '../http/apiClient'

class BudgetRepositoryImpl implements IBudgetRepository {
  async getAll(): Promise<BudgetScenario[]> {
    const { data } = await apiClient.get<{ data: BudgetScenario[] }>('/Budget/scenarios')
    return data.data ?? []
  }

  async getById(id: number): Promise<BudgetScenario> {
    const { data } = await apiClient.get<{ data: BudgetScenario }>(`/Budget/scenarios/${id}`)
    return data.data
  }

  async create(command: CreateScenarioCommand): Promise<BudgetScenario> {
    const { data } = await apiClient.post<{ data: BudgetScenario }>('/Budget/scenarios', command)
    return data.data
  }

  async update(id: number, command: UpdateScenarioCommand): Promise<void> {
    await apiClient.put(`/Budget/scenarios/${id}`, command)
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/Budget/scenarios/${id}`)
  }

  async uploadLines(id: number, file: File): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    await apiClient.post(`/Budget/scenarios/${id}/lines/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async importBudget(file: File): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    await apiClient.post('/Budget/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async downloadTemplate(): Promise<Blob> {
    const { data } = await apiClient.get('/Budget/template', {
      responseType: 'blob',
    })
    return data
  }
}

export const budgetRepository = new BudgetRepositoryImpl()
