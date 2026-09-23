import { describe, it, expect } from 'vitest'
import { remainingPageNumbers } from './pagination'

const MAX = 40

describe('remainingPageNumbers', () => {
  it('no pide nada cuando todo cupo en la primera página', () => {
    expect(remainingPageNumbers(250, 250, MAX)).toEqual([])
    expect(remainingPageNumbers(120, 250, MAX)).toEqual([])
  })

  it('no pide nada cuando no hay registros', () => {
    expect(remainingPageNumbers(0, 0, MAX)).toEqual([])
  })

  it('pide la segunda página cuando sobra menos de una página', () => {
    // el caso real: 473 cuentas de Activos con páginas de 250
    expect(remainingPageNumbers(473, 250, MAX)).toEqual([2])
  })

  it('pide todas las páginas que falten', () => {
    expect(remainingPageNumbers(1000, 250, MAX)).toEqual([2, 3, 4])
  })

  it('no pide una página de más cuando el total es múltiplo exacto', () => {
    expect(remainingPageNumbers(500, 250, MAX)).toEqual([2])
    expect(remainingPageNumbers(750, 250, MAX)).toEqual([2, 3])
  })

  it('deduce el tamaño de página de lo que devolvió el servidor, no de lo pedido', () => {
    expect(remainingPageNumbers(300, 100, MAX)).toEqual([2, 3])
  })

  it('respeta el tope de páginas', () => {
    expect(remainingPageNumbers(100000, 250, 3)).toEqual([2, 3])
  })

  it('no entra en bucle si la primera página vino vacía', () => {
    expect(remainingPageNumbers(473, 0, MAX)).toEqual([])
  })
})
