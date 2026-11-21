// Pruebas de TareaService (Integrante 1). Ejecutar con: npm test
// Usa un repositorio falso en memoria, asi no se necesita Firebase.
import { describe, it, expect, beforeEach } from 'vitest'
import { TareaService } from '../services/TareaService'

function crearRepositorioFalso() {
  const tareas = []
  const categorias = [{ id: 'c1', nombre: 'Universidad' }]
  let contador = 0
  return {
    async obtenerTareas() { return tareas.map((t) => ({ ...t })) },
    async obtenerCategorias() { return categorias },
    async guardarTarea(datos) {
      contador++
      tareas.push({ id: `t${contador}`, ...datos })
      return `t${contador}`
    },
    async actualizarTarea(id, datos) {
      const i = tareas.findIndex((t) => t.id === id)
      tareas[i] = { id, ...datos }
    },
    async eliminarTarea(id) {
      tareas.splice(tareas.findIndex((t) => t.id === id), 1)
    },
  }
}

const valida = {
  titulo: 'Estudiar para el examen',
  descripcion: 'Capítulos 1 a 3',
  fechaEntrega: '2026-11-20',
  prioridad: 'alta',
  categoriaId: 'c1',
}

describe('TareaService', () => {
  let servicio
  beforeEach(() => {
    servicio = new TareaService(crearRepositorioFalso())
  })

  it('crea una tarea válida como pendiente', async () => {
    const r = await servicio.crear(valida)
    expect(r.ok).toBe(true)
    expect(r.tarea).toMatchObject({ id: 't1', estado: 'pendiente' })
  })

  it('valida en orden: primero el título', async () => {
    const r = await servicio.crear({ ...valida, titulo: '  ', fechaEntrega: 'mala' })
    expect(r).toEqual({ ok: false, error: 'El título es obligatorio.' })
  })

  it('rechaza una fecha que no existe', async () => {
    const r = await servicio.crear({ ...valida, fechaEntrega: '2026-02-30' })
    expect(r.error).toBe('La fecha de entrega no es válida.')
  })

  it('rechaza una categoría que no existe', async () => {
    const r = await servicio.crear({ ...valida, categoriaId: 'c99' })
    expect(r.error).toBe('La categoría seleccionada no existe.')
  })

  it('no guarda nada si la validación falla', async () => {
    await servicio.crear({ ...valida, titulo: '' })
    expect(await servicio.listar()).toHaveLength(0)
  })

  it('edita una tarea', async () => {
    await servicio.crear(valida)
    const r = await servicio.editar('t1', { titulo: 'Nuevo título' })
    expect(r.ok).toBe(true)
    expect((await servicio.listar())[0].titulo).toBe('Nuevo título')
  })

  it('no edita con datos inválidos', async () => {
    await servicio.crear(valida)
    const r = await servicio.editar('t1', { prioridad: 'urgente' })
    expect(r.ok).toBe(false)
    expect((await servicio.listar())[0].prioridad).toBe('alta')
  })

  it('marca como completada y la vuelve a pendiente', async () => {
    await servicio.crear(valida)
    expect((await servicio.cambiarEstado('t1')).tarea.estado).toBe('completada')
    expect((await servicio.cambiarEstado('t1')).tarea.estado).toBe('pendiente')
  })

  it('elimina una tarea', async () => {
    await servicio.crear(valida)
    expect((await servicio.eliminar('t1')).ok).toBe(true)
    expect(await servicio.listar()).toHaveLength(0)
  })

  it('avisa si la tarea no existe', async () => {
    expect(await servicio.eliminar('t99')).toEqual({ ok: false, error: 'La tarea no existe.' })
  })
})
