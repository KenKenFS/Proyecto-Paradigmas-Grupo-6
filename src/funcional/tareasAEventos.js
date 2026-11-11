// Funcion pura (paradigma funcional): convierte tareas en eventos de FullCalendar.
// No modifica la lista original, no importa React ni Firebase (riesgo 7).
// "hoy" llega por parametro para marcar las vencidas.
export function tareasAEventos(tareas, hoy) {
  return tareas.map((tarea) => {
    const vencida = tarea.estado !== 'completada' && tarea.fechaEntrega < hoy
    return {
      id: tarea.id,
      title: tarea.titulo,
      start: tarea.fechaEntrega,
      allDay: true,
      classNames: [
        `evento-${tarea.prioridad}`,
        tarea.estado === 'completada' ? 'evento-completada' : '',
        vencida ? 'evento-vencida' : '',
      ].filter(Boolean),
      extendedProps: { tarea, vencida },
    }
  })
}
