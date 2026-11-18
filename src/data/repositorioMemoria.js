// TEMPORAL (Integrante 1): repositorio que guarda las tareas en memoria,
// para poder usar TareaService mientras data/repositorio.js (Firestore) no existe.
// Tiene los mismos metodos que debe tener el repositorio real, asi que cuando
// el Integrante 2 lo termine solo se cambia una linea en hooks/useTareas.js.
// Ojo: al recargar la pagina se pierden los cambios (vuelven los datos de ejemplo).
import { categoriasEjemplo, crearTareasEjemplo } from './tareasEjemplo'

export function crearRepositorioMemoria(hoy) {
  let tareas = crearTareasEjemplo(hoy)
  const categorias = categoriasEjemplo

  return {
    async obtenerTareas() {
      return tareas.map((t) => ({ ...t }))
    },
    async obtenerCategorias() {
      return categorias
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
  }
}
