// Capa de estado: entrega los datos a los componentes. No contiene reglas de negocio.
// Las operaciones del CRUD pasan por TareaService (Integrante 1), que valida.
// TODO (Integrante 2): cambiar crearRepositorioMemoria por data/repositorio.js.
import { useCallback, useEffect, useState } from 'react'
import { categoriasEjemplo, formatearFecha } from '../data/tareasEjemplo'
import { crearRepositorioMemoria } from '../data/repositorioMemoria'
import { TareaService } from '../services/TareaService'

export function useTareas() {
  // "hoy" se calcula aquí, en la capa de control, y baja por parámetro
  // a las funciones puras (que nunca leen el reloj).
  const [hoy] = useState(() => formatearFecha(new Date()))
  const [servicio] = useState(() => new TareaService(crearRepositorioMemoria(hoy)))
  const [tareas, setTareas] = useState([])

  const recargar = useCallback(async () => {
    setTareas(await servicio.listar())
  }, [servicio])

  // Al abrir la app, lee las tareas una vez.
  useEffect(() => {
    servicio.listar().then(setTareas)
  }, [servicio])

  // Ejecuta una operación del servicio y, si salió bien, vuelve a leer las tareas.
  async function ejecutar(operacion) {
    const resultado = await operacion()
    if (resultado.ok) await recargar()
    return resultado
  }

  return {
    tareas,
    categorias: categoriasEjemplo,
    hoy,
    crearTarea: (datos) => ejecutar(() => servicio.crear(datos)),
    editarTarea: (id, cambios) => ejecutar(() => servicio.editar(id, cambios)),
    cambiarEstado: (id) => ejecutar(() => servicio.cambiarEstado(id)),
    eliminarTarea: (id) => ejecutar(() => servicio.eliminar(id)),
  }
}
