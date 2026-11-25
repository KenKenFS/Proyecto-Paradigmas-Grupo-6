// Integrante 2 - Paradigma orientado a objetos.
// Clase Categoria: nombre, color y relacion uno a muchos con Tarea
// (una categoria tiene muchas tareas; cada tarea guarda el categoriaId).
//
// La categoria encapsula sus datos (atributos privados #) y sus reglas:
// como validarse, que tareas le pertenecen y si se puede eliminar.

export const LARGO_MAXIMO_NOMBRE = 30
const FORMATO_COLOR = /^#[0-9a-fA-F]{6}$/

export class Categoria {
  #id
  #nombre
  #color

  constructor({ id = null, nombre, color = '#7d8da0' }) {
    this.#id = id
    this.#nombre = String(nombre ?? '').trim()
    this.#color = FORMATO_COLOR.test(color) ? color : '#7d8da0'
  }

  get id() { return this.#id }
  get nombre() { return this.#nombre }
  get color() { return this.#color }

  // ---------- Relacion uno a muchos con Tarea ----------
  // Recibe la lista completa y devuelve solo las tareas de esta categoria.
  tareasDe(tareas) {
    return tareas.filter((tarea) => tarea.categoriaId === this.#id)
  }

  contarTareas(tareas) {
    return this.tareasDe(tareas).length
  }

  // No se elimina una categoria con tareas: quedarian tareas "huerfanas".
  puedeEliminarse(tareas) {
    return this.contarTareas(tareas) === 0
  }

  // ---------- Validacion ----------
  // Devuelve null si los datos son validos, o el mensaje del primer error.
  // "existentes" son las demas categorias, para no repetir nombres.
  static validar({ nombre, color }, existentes = [], idPropio = null) {
    const limpio = String(nombre ?? '').trim()
    if (limpio === '') {
      return 'El nombre de la categoría es obligatorio.'
    }
    if (limpio.length > LARGO_MAXIMO_NOMBRE) {
      return `El nombre no puede tener más de ${LARGO_MAXIMO_NOMBRE} caracteres.`
    }
    const repetida = existentes.some(
      (c) => c.id !== idPropio && c.nombre.trim().toLowerCase() === limpio.toLowerCase(),
    )
    if (repetida) {
      return 'Ya existe una categoría con ese nombre.'
    }
    if (!FORMATO_COLOR.test(color ?? '')) {
      return 'El color no es válido.'
    }
    return null
  }

  // ---------- Conversiones ----------
  aFirestore() {
    return { nombre: this.#nombre, color: this.#color }
  }

  aObjeto() {
    return { id: this.#id, ...this.aFirestore() }
  }

  static desdeFirestore(id, datos) {
    return new Categoria({ ...datos, id })
  }
}
