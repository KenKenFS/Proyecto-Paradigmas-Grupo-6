// Capa de estado: entrega los datos a los componentes. No contiene reglas de negocio.
// TODO (Integrante 2): reemplazar los datos de ejemplo por data/repositorio.js.
import { useMemo, useState } from 'react'
import {
  categoriasEjemplo,
  crearTareasEjemplo,
  formatearFecha,
} from '../data/tareasEjemplo'

export function useTareas() {
  // "hoy" se calcula aquí, en la capa de control, y baja por parámetro
  // a las funciones puras (que nunca leen el reloj).
  const [hoy] = useState(() => formatearFecha(new Date()))
  const tareas = useMemo(() => crearTareasEjemplo(hoy), [hoy])
  return { tareas, categorias: categoriasEjemplo, hoy }
}
