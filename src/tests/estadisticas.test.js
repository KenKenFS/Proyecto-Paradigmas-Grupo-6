import { describe, expect, it } from 'vitest'
import {
  calcularEstadisticas,
  contarPorCategoria,
  contarPorPrioridad,
} from '../funcional/estadisticas.js'

const HOY = '2026-11-17'

const TAREAS = [
  { id: '1', titulo: 'A', estado: 'completada', fechaEntrega: '2026-11-10', prioridad: 'alta', categoriaId: 'c1' },
  { id: '2', titulo: 'B', estado: 'completada', fechaEntrega: '2026-11-20', prioridad: 'media', categoriaId: 'c1' },
  { id: '3', titulo: 'C', estado: 'pendiente', fechaEntrega: '2026-11-10', prioridad: 'alta', categoriaId: 'c2' },
  { id: '4', titulo: 'D', estado: 'pendiente', fechaEntrega: '2026-11-20', prioridad: 'baja', categoriaId: 'c2' },
  { id: '5', titulo: 'E', estado: 'pendiente', fechaEntrega: '2026-11-17', prioridad: 'media', categoriaId: 'c3' },
]

describe('calcularEstadisticas', () => {
  it('cuenta pendientes, completadas, vencidas y el porcentaje', () => {
    // 2 completadas, 1 vencida (C), 2 pendientes no vencidas (D, E) → 40%
    expect(calcularEstadisticas(TAREAS, HOY)).toEqual({
      pendientes: 2,
      completadas: 2,
      vencidas: 1,
      porcentaje: 40,
    })
  })

  it('una tarea completada nunca cuenta como vencida', () => {
    const soloHecha = [
      { id: 'x', estado: 'completada', fechaEntrega: '2020-01-01', prioridad: 'alta', categoriaId: 'c1' },
    ]
    expect(calcularEstadisticas(soloHecha, HOY)).toEqual({
      pendientes: 0,
      completadas: 1,
      vencidas: 0,
      porcentaje: 100,
    })
  })

  it('devuelve ceros si no hay tareas', () => {
    expect(calcularEstadisticas([], HOY)).toEqual({
      pendientes: 0,
      completadas: 0,
      vencidas: 0,
      porcentaje: 0,
    })
  })

  it('no modifica el arreglo original', () => {
    const copia = structuredClone(TAREAS)
    calcularEstadisticas(TAREAS, HOY)
    expect(TAREAS).toEqual(copia)
  })
})

describe('contarPorPrioridad', () => {
  it('agrupa con reduce por prioridad', () => {
    expect(contarPorPrioridad(TAREAS)).toEqual({ alta: 2, media: 2, baja: 1 })
  })
})

describe('contarPorCategoria', () => {
  it('agrupa con reduce por categoriaId', () => {
    expect(contarPorCategoria(TAREAS)).toEqual({ c1: 2, c2: 2, c3: 1 })
  })
})
