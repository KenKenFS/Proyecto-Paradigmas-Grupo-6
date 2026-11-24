// Integrante 3 - Paradigma funcional.
// calcularEstadisticas(tareas, hoy): funcion pura. "hoy" llega por parametro
// (AAAA-MM-DD), nunca se lee el reloj del sistema aqui dentro.

function esVencida(tarea, hoy) {
  if (tarea.estado === 'completada') return false
  if (!tarea.fechaEntrega || !hoy) return false
  return tarea.fechaEntrega < hoy
}

/**
 * Devuelve { pendientes, completadas, vencidas, porcentaje }.
 * - completadas: estado === 'completada'
 * - vencidas: no completada y fechaEntrega < hoy
 * - pendientes: no completada y no vencida
 * - porcentaje: productividad = completadas / total * 100 (0 si no hay tareas)
 */
export function calcularEstadisticas(tareas, hoy) {
  const resumen = tareas.reduce(
    (acc, tarea) => {
      if (tarea.estado === 'completada') {
        acc.completadas += 1
      } else if (esVencida(tarea, hoy)) {
        acc.vencidas += 1
      } else {
        acc.pendientes += 1
      }
      return acc
    },
    { pendientes: 0, completadas: 0, vencidas: 0 },
  )

  const total = tareas.length
  const porcentaje = total === 0
    ? 0
    : Math.round((resumen.completadas / total) * 100)

  return { ...resumen, porcentaje }
}

/** Conteo por prioridad con reduce (funcion pura). */
export function contarPorPrioridad(tareas) {
  return tareas.reduce(
    (acc, tarea) => {
      const clave = tarea.prioridad || 'media'
      acc[clave] = (acc[clave] ?? 0) + 1
      return acc
    },
    { alta: 0, media: 0, baja: 0 },
  )
}

/** Conteo por categoriaId con reduce (funcion pura). */
export function contarPorCategoria(tareas) {
  return tareas.reduce((acc, tarea) => {
    const clave = tarea.categoriaId ?? 'sin-categoria'
    acc[clave] = (acc[clave] ?? 0) + 1
    return acc
  }, {})
}
