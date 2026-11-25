// Integrante 2 - Paradigma orientado a objetos.
// Administracion de categorias: crear, editar y eliminar.
// Usa objetos Categoria (models/Categoria.js) para validar y para revisar la
// relacion con las tareas antes de eliminar.
//
// Igual que TareaService, no habla con Firebase: recibe el repositorio en el
// constructor y devuelve { ok: true, ... } o { ok: false, error }.
import { Categoria } from '../models/Categoria'

export class CategoriaService {
  #repositorio

  constructor(repositorio) {
    this.#repositorio = repositorio
  }

  async listar() {
    return this.#repositorio.obtenerCategorias()
  }

  async crear(datos) {
    const existentes = await this.#repositorio.obtenerCategorias()
    const error = Categoria.validar(datos, existentes)
    if (error) {
      return { ok: false, error }
    }

    const categoria = new Categoria(datos)
    const id = await this.#repositorio.guardarCategoria(categoria.aFirestore())
    return { ok: true, categoria: { id, ...categoria.aFirestore() } }
  }

  async editar(id, cambios) {
    const existentes = await this.#repositorio.obtenerCategorias()
    const actual = existentes.find((c) => c.id === id)
    if (!actual) {
      return { ok: false, error: 'La categoría no existe.' }
    }

    const datos = { ...actual, ...cambios }
    const error = Categoria.validar(datos, existentes, id)
    if (error) {
      return { ok: false, error }
    }

    const categoria = new Categoria({ ...datos, id })
    await this.#repositorio.actualizarCategoria(id, categoria.aFirestore())
    return { ok: true, categoria: categoria.aObjeto() }
  }

  // Solo se elimina si no tiene tareas (relacion uno a muchos).
  async eliminar(id) {
    const existentes = await this.#repositorio.obtenerCategorias()
    const actual = existentes.find((c) => c.id === id)
    if (!actual) {
      return { ok: false, error: 'La categoría no existe.' }
    }

    const categoria = new Categoria(actual)
    const tareas = await this.#repositorio.obtenerTareas()
    if (!categoria.puedeEliminarse(tareas)) {
      const n = categoria.contarTareas(tareas)
      return {
        ok: false,
        error: `No se puede eliminar "${categoria.nombre}": tiene ${n} ${n === 1 ? 'tarea' : 'tareas'}. Muévelas o elimínalas primero.`,
      }
    }

    await this.#repositorio.eliminarCategoria(id)
    return { ok: true }
  }

  // La primera vez (base de datos vacia) crea las categorias iniciales,
  // para que el formulario de tareas tenga opciones.
  async asegurarIniciales(iniciales) {
    const existentes = await this.#repositorio.obtenerCategorias()
    if (existentes.length > 0) {
      return
    }
    for (const datos of iniciales) {
      await this.#repositorio.guardarCategoria(new Categoria(datos).aFirestore())
    }
  }
}
