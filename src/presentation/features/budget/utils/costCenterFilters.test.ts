import { describe, it, expect } from 'vitest'
import {
  COST_CENTER_DIM_CODE,
  COST_CENTER_DIM_FILTER,
  costCenterByCodeFilter,
} from './costCenterFilters'

describe('filtros de centros de costos', () => {
  it('la dimensión del presupuesto es la 4', () => {
    expect(COST_CENTER_DIM_CODE).toBe(4)
  })

  it('el filtro de dimensión pide solo esa dimensión', () => {
    expect(COST_CENTER_DIM_FILTER).toBe('DimCode==4')
  })

  it('el filtro por código acota a la dimensión y al código', () => {
    expect(costCenterByCodeFilter('OCR001')).toBe('DimCode==4 and Code=="OCR001"')
  })

  it('escapa las comillas del código para no romper la expresión', () => {
    expect(costCenterByCodeFilter('A"B')).toBe('DimCode==4 and Code=="A\\"B"')
  })
})
