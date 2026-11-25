// Pruebas de la clase Categoria (Integrante 2). Ejecutar con: npm test
import { describe, it, expect } from 'vitest'
import { Categoria } from '../models/Categoria'

const tareas = [
  { id: 't1', categoriaId: 'c1' },
  { id: 't2', categoriaId: 'c1' },
  { id: 't3', categoriaId: 'c2' },
]

describe('Categoria', () => {
  it('relación uno a muchos: devuelve y cuenta sus tareas', () => {
    const c = new Categoria({ id: 'c1', nombre: 'Universidad', color: '#4f5f47' })
    expect(c.tareasDe(tareas).map((t) => t.id)).toEqual(['t1', 't2'])
    expect(c.contarTareas(tareas)).toBe(2)
  })

  it('solo se puede eliminar si no tiene tareas', () => {
    expect(new Categoria({ id: 'c1', nombre: 'A' }).puedeEliminarse(tareas)).toBe(false)
    expect(new Categoria({ id: 'c9', nombre: 'B' }).puedeEliminarse(tareas)).toBe(true)
  })

  it('usa un color por defecto si el color no es válido', () => {
    expect(new Categoria({ nombre: 'A', color: 'rojo' }).color).toBe('#7d8da0')
  })

  describe('validar', () => {
    const existentes = [{ id: 'c1', nombre: 'Trabajo', color: '#000000' }]

    it('acepta datos correctos', () => {
      expect(Categoria.validar({ nombre: 'Hogar', color: '#123abc' }, existentes)).toBeNull()
    })

    it('exige el nombre', () => {
      expect(Categoria.validar({ nombre: '   ', color: '#123abc' })).toBe('El nombre de la categoría es obligatorio.')
    })

    it('limita el largo del nombre', () => {
      expect(Categoria.validar({ nombre: 'x'.repeat(31), color: '#123abc' })).toMatch(/más de 30/)
    })

    it('no permite nombres repetidos (sin importar mayúsculas)', () => {
      expect(Categoria.validar({ nombre: ' trabajo ', color: '#123abc' }, existentes)).toBe(
        'Ya existe una categoría con ese nombre.',
      )
    })

    it('al editar, puede conservar su propio nombre', () => {
      expect(Categoria.validar({ nombre: 'Trabajo', color: '#123abc' }, existentes, 'c1')).toBeNull()
    })

    it('rechaza un color inválido', () => {
      expect(Categoria.validar({ nombre: 'Hogar', color: 'azul' })).toBe('El color no es válido.')
    })
  })
})
