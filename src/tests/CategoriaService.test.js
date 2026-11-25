// Pruebas de CategoriaService (Integrante 2). Usa el repositorio en memoria,
// asi no se necesita Firebase. Ejecutar con: npm test
import { describe, it, expect, beforeEach } from 'vitest'
import { CategoriaService } from '../services/CategoriaService'
import { TareaService } from '../services/TareaService'
import { crearRepositorioMemoria } from '../data/repositorioMemoria'

describe('CategoriaService', () => {
  let repositorio
  let servicio

  beforeEach(() => {
    repositorio = crearRepositorioMemoria('2026-11-24')
    servicio = new CategoriaService(repositorio)
  })

  it('crea una categoría válida', async () => {
    const r = await servicio.crear({ nombre: 'Deporte', color: '#336699' })
    expect(r.ok).toBe(true)
    expect((await servicio.listar()).map((c) => c.nombre)).toContain('Deporte')
  })

  it('no crea una categoría repetida', async () => {
    const r = await servicio.crear({ nombre: 'universidad', color: '#336699' })
    expect(r).toEqual({ ok: false, error: 'Ya existe una categoría con ese nombre.' })
  })

  it('edita el nombre y el color', async () => {
    const r = await servicio.editar('c1', { nombre: 'U', color: '#000000' })
    expect(r.ok).toBe(true)
    const c1 = (await servicio.listar()).find((c) => c.id === 'c1')
    expect(c1).toEqual({ id: 'c1', nombre: 'U', color: '#000000' })
  })

  it('no elimina una categoría que tiene tareas', async () => {
    const r = await servicio.eliminar('c1')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/tiene \d+ tareas/)
  })

  it('elimina una categoría sin tareas', async () => {
    const { categoria } = await servicio.crear({ nombre: 'Vacía', color: '#336699' })
    expect((await servicio.eliminar(categoria.id)).ok).toBe(true)
  })

  it('una categoría nueva se puede usar al crear tareas', async () => {
    const { categoria } = await servicio.crear({ nombre: 'Deporte', color: '#336699' })
    const r = await new TareaService(repositorio).crear({
      titulo: 'Correr', fechaEntrega: '2026-11-30', prioridad: 'baja', categoriaId: categoria.id,
    })
    expect(r.ok).toBe(true)
  })

  it('crea las categorías iniciales solo si no hay ninguna', async () => {
    const vacio = { ...repositorio, obtenerCategorias: async () => [], guardarCategoria: async () => 'x' }
    let guardadas = 0
    vacio.guardarCategoria = async () => { guardadas++; return 'x' }
    await new CategoriaService(vacio).asegurarIniciales([{ nombre: 'A', color: '#000000' }, { nombre: 'B', color: '#000000' }])
    expect(guardadas).toBe(2)

    await servicio.asegurarIniciales([{ nombre: 'Z', color: '#000000' }])
    expect((await servicio.listar()).some((c) => c.nombre === 'Z')).toBe(false)
  })
})
