import { describe, expect, it } from 'vitest'
import { filtrarTareas } from '../funcional/filtros.js'

const TAREAS = [
  { id: '1', titulo: 'Examen de Paradigmas', estado: 'pendiente', prioridad: 'alta', categoriaId: 'c1' },
  { id: '2', titulo: 'Informe semanal', estado: 'pendiente', prioridad: 'media', categoriaId: 'c2' },
  { id: '3', titulo: 'Ir al gimnasio', estado: 'completada', prioridad: 'baja', categoriaId: 'c3' },
  { id: '4', titulo: 'Revisar examen oral', estado: 'completada', prioridad: 'alta', categoriaId: 'c1' },
]

describe('filtrarTareas', () => {
  it('devuelve todas las tareas si no hay criterios', () => {
    expect(filtrarTareas(TAREAS, {})).toHaveLength(4)
    expect(filtrarTareas(TAREAS)).toEqual(TAREAS)
  })

  it('no modifica el arreglo original', () => {
    const copia = [...TAREAS]
    filtrarTareas(TAREAS, { texto: 'examen', estado: 'pendiente' })
    expect(TAREAS).toEqual(copia)
  })

  it('busca por nombre sin distinguir mayúsculas', () => {
    const resultado = filtrarTareas(TAREAS, { texto: '  EXAMEN ' })
    expect(resultado.map((t) => t.id)).toEqual(['1', '4'])
  })

  it('filtra por estado', () => {
    const resultado = filtrarTareas(TAREAS, { estado: 'completada' })
    expect(resultado.map((t) => t.id)).toEqual(['3', '4'])
  })

  it('filtra por prioridad', () => {
    const resultado = filtrarTareas(TAREAS, { prioridad: 'alta' })
    expect(resultado.map((t) => t.id)).toEqual(['1', '4'])
  })

  it('filtra por categoría', () => {
    const resultado = filtrarTareas(TAREAS, { categoriaId: 'c2' })
    expect(resultado.map((t) => t.id)).toEqual(['2'])
  })

  it('combina varios criterios', () => {
    const resultado = filtrarTareas(TAREAS, {
      texto: 'examen',
      estado: 'completada',
      prioridad: 'alta',
      categoriaId: 'c1',
    })
    expect(resultado.map((t) => t.id)).toEqual(['4'])
  })

  it('devuelve lista vacía si nada coincide', () => {
    expect(filtrarTareas(TAREAS, { texto: 'xyz' })).toEqual([])
  })
})
