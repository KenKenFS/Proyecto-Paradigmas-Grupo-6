import { describe, it, expect } from 'vitest'
import { tareasAEventos } from '../funcional/tareasAEventos'

describe('tareasAEventos', () => {
  const hoy = '2026-11-17'
  const tareas = [
    { id: 't1', titulo: 'A', fechaEntrega: '2026-11-15', prioridad: 'alta', estado: 'pendiente' },
    { id: 't2', titulo: 'B', fechaEntrega: '2026-11-15', prioridad: 'baja', estado: 'completada' },
    { id: 't3', titulo: 'C', fechaEntrega: '2026-11-20', prioridad: 'media', estado: 'pendiente' },
  ]

  it('marca como vencida una tarea pendiente con fecha pasada', () => {
    const [e] = tareasAEventos(tareas, hoy)
    expect(e.extendedProps.vencida).toBe(true)
    expect(e.classNames).toContain('evento-vencida')
  })

  it('no marca como vencida una tarea completada', () => {
    const [, e] = tareasAEventos(tareas, hoy)
    expect(e.extendedProps.vencida).toBe(false)
    expect(e.classNames).toContain('evento-completada')
  })

  it('no marca como vencida una tarea futura', () => {
    const [, , e] = tareasAEventos(tareas, hoy)
    expect(e.extendedProps.vencida).toBe(false)
    expect(e.classNames).toEqual(['evento-media'])
  })

  it('no modifica la lista original', () => {
    const copia = structuredClone(tareas)
    tareasAEventos(tareas, hoy)
    expect(tareas).toEqual(copia)
  })
})
