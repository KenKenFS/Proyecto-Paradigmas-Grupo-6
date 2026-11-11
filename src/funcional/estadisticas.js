// Integrante 3 - Paradigma funcional.
// calcularEstadisticas(tareas, hoy): funcion pura. "hoy" llega por parametro
// (AAAA-MM-DD), nunca se lee el reloj del sistema aqui dentro.
export function calcularEstadisticas(tareas, hoy) {
  return { pendientes: 0, completadas: 0, vencidas: 0, porcentaje: 0 }
}
