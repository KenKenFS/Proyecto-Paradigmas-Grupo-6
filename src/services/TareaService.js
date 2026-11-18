// Integrante 1 - Paradigma imperativo.
// Crear, editar, eliminar y completar tareas. Valida en orden: titulo, fecha, categoria.
// Si una validacion falla devuelve un mensaje especifico y no guarda nada.
//
// Por que es imperativo: el codigo es una SECUENCIA de instrucciones que se
// ejecutan en orden. Cada "if" revisa una condicion y, si falla, corta el flujo
// con su propio mensaje. Los ciclos "for" recorren las listas paso a paso.
//
// El servicio NO habla con Firebase: recibe el repositorio (Integrante 2) en el
// constructor. El repositorio solo necesita estos metodos:
//   obtenerTareas()            -> arreglo de tareas { id, titulo, ... }
//   obtenerCategorias()        -> arreglo de categorias { id, nombre, ... }
//   guardarTarea(datos)        -> devuelve el id de la tarea nueva
//   actualizarTarea(id, datos)
//   eliminarTarea(id)

const PRIORIDADES = ['baja', 'media', 'alta']
const LARGO_MAXIMO_TITULO = 100

export class TareaService {
  #repositorio

  constructor(repositorio) {
    this.#repositorio = repositorio
  }

  // ---------- Validacion (paso a paso, en orden) ----------
  // Devuelve null si todo esta bien, o el texto del primer error encontrado.
  async validar(datos) {
    // 1. Titulo
    if (!datos.titulo || datos.titulo.trim() === '') {
      return 'El título es obligatorio.'
    }
    if (datos.titulo.trim().length > LARGO_MAXIMO_TITULO) {
      return `El título no puede tener más de ${LARGO_MAXIMO_TITULO} caracteres.`
    }

    // 2. Fecha de entrega
    if (!datos.fechaEntrega) {
      return 'La fecha de entrega es obligatoria.'
    }
    if (!esFechaValida(datos.fechaEntrega)) {
      return 'La fecha de entrega no es válida.'
    }

    // 3. Prioridad
    if (!PRIORIDADES.includes(datos.prioridad)) {
      return 'La prioridad debe ser baja, media o alta.'
    }

    // 4. Categoria: debe venir y debe existir
    if (!datos.categoriaId) {
      return 'Debe seleccionar una categoría.'
    }
    const categorias = await this.#repositorio.obtenerCategorias()
    let existe = false
    for (const categoria of categorias) {
      if (categoria.id === datos.categoriaId) {
        existe = true
        break
      }
    }
    if (!existe) {
      return 'La categoría seleccionada no existe.'
    }

    return null
  }

  // ---------- Crear ----------
  async crear(datos) {
    const error = await this.validar(datos)
    if (error) {
      return { ok: false, error }
    }

    const nueva = {
      titulo: datos.titulo.trim(),
      descripcion: (datos.descripcion ?? '').trim(),
      fechaEntrega: datos.fechaEntrega,
      prioridad: datos.prioridad,
      estado: 'pendiente',
      categoriaId: datos.categoriaId,
    }
    const id = await this.#repositorio.guardarTarea(nueva)
    return { ok: true, tarea: { id, ...nueva } }
  }

  // ---------- Leer ----------
  async listar() {
    return this.#repositorio.obtenerTareas()
  }

  // ---------- Editar ----------
  async editar(id, cambios) {
    const actual = await this.#buscarTarea(id)
    if (!actual) {
      return { ok: false, error: 'La tarea no existe.' }
    }

    // Se valida como quedaria la tarea con los cambios aplicados
    const editada = { ...actual, ...cambios, id }
    const error = await this.validar(editada)
    if (error) {
      return { ok: false, error }
    }

    editada.titulo = editada.titulo.trim()
    const { id: _id, ...datos } = editada
    await this.#repositorio.actualizarTarea(id, datos)
    return { ok: true, tarea: editada }
  }

  // ---------- Completar / reabrir ----------
  // Si esta pendiente la marca como completada, y al reves.
  async cambiarEstado(id) {
    const actual = await this.#buscarTarea(id)
    if (!actual) {
      return { ok: false, error: 'La tarea no existe.' }
    }

    let nuevoEstado
    if (actual.estado === 'completada') {
      nuevoEstado = 'pendiente'
    } else {
      nuevoEstado = 'completada'
    }

    const { id: _id, ...datos } = actual
    datos.estado = nuevoEstado
    await this.#repositorio.actualizarTarea(id, datos)
    return { ok: true, tarea: { id, ...datos } }
  }

  // ---------- Eliminar ----------
  async eliminar(id) {
    const actual = await this.#buscarTarea(id)
    if (!actual) {
      return { ok: false, error: 'La tarea no existe.' }
    }

    await this.#repositorio.eliminarTarea(id)
    return { ok: true }
  }

  // Recorre la lista de tareas hasta encontrar la que tiene ese id.
  async #buscarTarea(id) {
    const tareas = await this.#repositorio.obtenerTareas()
    for (const tarea of tareas) {
      if (tarea.id === id) {
        return tarea
      }
    }
    return null
  }
}

// Revisa que el texto tenga formato AAAA-MM-DD y que sea una fecha real
// (por ejemplo, rechaza '2026-02-30').
function esFechaValida(texto) {
  if (typeof texto !== 'string') {
    return false
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return false
  }
  const [anio, mes, dia] = texto.split('-').map(Number)
  const fecha = new Date(anio, mes - 1, dia)
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
    return false
  }
  return true
}
