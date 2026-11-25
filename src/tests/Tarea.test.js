// Pruebas de la clase Tarea (Integrante 2). Ejecutar con: npm test
import { describe, it, expect } from 'vitest'
import { Tarea } from '../models/Tarea'

const datos = {
  titulo: '  Estudiar  ',
  descripcion: 'Capítulo 1',
  fechaEntrega: '2026-11-20',
  prioridad: 'alta',
  estado: 'pendiente',
  categoriaId: 'c1',
}

describe('Tarea', () => {
  it('expone sus datos con getters y limpia el título', () => {
    const t = new Tarea({ ...datos, id: 't1' })
    expect(t.id).toBe('t1')
    expect(t.titulo).toBe('Estudiar')
    expect(t.categoriaId).toBe('c1')
  })

  it('encapsula sus atributos: no se pueden cambiar desde fuera', () => {
    const t = new Tarea(datos)
    expect(() => { t.titulo = 'Otro' }).toThrow(TypeError)
    expect(t.titulo).toBe('Estudiar')
  })

  it('usa valores por defecto si la prioridad o el estado no son válidos', () => {
    const t = new Tarea({ ...datos, prioridad: 'urgente', estado: 'rara' })
    expect(t.prioridad).toBe('media')
    expect(t.estado).toBe('pendiente')
  })

  it('sabe si está vencida según "hoy"', () => {
    const t = new Tarea(datos)
    expect(t.estaVencida('2026-11-21')).toBe(true)
    expect(t.estaVencida('2026-11-20')).toBe(false)
    expect(new Tarea({ ...datos, estado: 'completada' }).estaVencida('2026-12-01')).toBe(false)
  })

  it('sabe a qué categoría pertenece', () => {
    const t = new Tarea(datos)
    expect(t.perteneceA({ id: 'c1' })).toBe(true)
    expect(t.perteneceA({ id: 'c2' })).toBe(false)
    expect(t.perteneceA(null)).toBe(false)
  })

  it('se convierte para Firestore sin el id, y a objeto simple con el id', () => {
    const t = Tarea.desdeFirestore('t1', datos)
    expect(t.aFirestore()).not.toHaveProperty('id')
    expect(t.aObjeto()).toEqual({ ...datos, titulo: 'Estudiar', id: 't1' })
  })
})
