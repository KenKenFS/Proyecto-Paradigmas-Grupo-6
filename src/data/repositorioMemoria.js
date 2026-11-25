// TEMPORAL (Integrante 1): repositorio que guarda las tareas en memoria.
// Se usa cuando no hay .env.local con las llaves de Firebase (ver data/firebase.js).
// Tiene los mismos metodos que data/repositorio.js (Firestore).
// Ojo: al recargar la pagina se pierden los cambios (vuelven los datos de ejemplo).
import { categoriasEjemplo, crearTareasEjemplo } from './tareasEjemplo'

export function crearRepositorioMemoria(hoy) {
  let tareas = crearTareasEjemplo(hoy)
  let categorias = categoriasEjemplo.map((c) => ({ ...c }))

  return {
    async obtenerTareas() {
      return tareas.map((t) => ({ ...t }))
    },
    async guardarTarea(datos) {
      const id = crypto.randomUUID()
      tareas = [...tareas, { id, ...datos }]
      return id
    },
    async actualizarTarea(id, datos) {
      tareas = tareas.map((t) => (t.id === id ? { id, ...datos } : t))
    },
    async eliminarTarea(id) {
      tareas = tareas.filter((t) => t.id !== id)
    },

    async obtenerCategorias() {
      return categorias.map((c) => ({ ...c }))
    },
    async guardarCategoria(datos) {
      const id = crypto.randomUUID()
      categorias = [...categorias, { id, ...datos }]
      return id
    },
    async actualizarCategoria(id, datos) {
      categorias = categorias.map((c) => (c.id === id ? { id, ...datos } : c))
    },
    async eliminarCategoria(id) {
      categorias = categorias.filter((c) => c.id !== id)
    },
  }
}
