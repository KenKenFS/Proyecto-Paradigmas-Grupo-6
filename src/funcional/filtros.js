// Integrante 3 - Paradigma funcional.
// filtrarTareas(tareas, criterios): funcion pura. No importa React ni Firebase,
// no modifica los argumentos y devuelve una lista nueva.

/**
 * Criterios opcionales:
 * - texto: busca en el titulo (sin distinguir mayusculas)
 * - estado: 'pendiente' | 'completada'
 * - categoriaId: id de categoria
 * - prioridad: 'alta' | 'media' | 'baja'
 */
export function filtrarTareas(tareas, criterios = {}) {
  const {
    texto = '',
    estado = '',
    categoriaId = '',
    prioridad = '',
  } = criterios

  const busqueda = texto.trim().toLowerCase()

  return tareas.filter((tarea) => {
    const coincideTexto = !busqueda
      || String(tarea.titulo ?? '').toLowerCase().includes(busqueda)

    const coincideEstado = !estado || tarea.estado === estado

    const coincideCategoria = !categoriaId || tarea.categoriaId === categoriaId

    const coincidePrioridad = !prioridad || tarea.prioridad === prioridad

    return coincideTexto && coincideEstado && coincideCategoria && coincidePrioridad
  })
}
