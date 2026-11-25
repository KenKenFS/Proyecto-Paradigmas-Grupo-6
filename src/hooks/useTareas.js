// Capa de estado: entrega los datos a los componentes. No contiene reglas de negocio.
// Las operaciones pasan por TareaService (Integrante 1) y CategoriaService (Integrante 2).
// Con .env.local usa Firestore (data/repositorio.js); sin el, el repositorio en memoria.
import { useCallback, useEffect, useState } from 'react'
import { categoriasEjemplo, formatearFecha } from '../data/tareasEjemplo'
import { crearRepositorioMemoria } from '../data/repositorioMemoria'
import { crearRepositorioFirestore } from '../data/repositorio'
import { firebaseConfigurado, obtenerDb } from '../data/firebase'
import { TareaService } from '../services/TareaService'
import { CategoriaService } from '../services/CategoriaService'

function crearRepositorio(hoy) {
  return firebaseConfigurado ? crearRepositorioFirestore(obtenerDb()) : crearRepositorioMemoria(hoy)
}

// Categorias que se crean la primera vez que la base de datos esta vacia.
const CATEGORIAS_INICIALES = categoriasEjemplo.map(({ nombre, color }) => ({ nombre, color }))

export function useTareas() {
  // "hoy" se calcula aquí, en la capa de control, y baja por parámetro
  // a las funciones puras (que nunca leen el reloj).
  const [hoy] = useState(() => formatearFecha(new Date()))
  const [servicios] = useState(() => {
    const repositorio = crearRepositorio(hoy)
    return {
      tareas: new TareaService(repositorio),
      categorias: new CategoriaService(repositorio),
    }
  })
  const [tareas, setTareas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const recargar = useCallback(async () => {
    const [listaTareas, listaCategorias] = await Promise.all([
      servicios.tareas.listar(),
      servicios.categorias.listar(),
    ])
    setTareas(listaTareas)
    setCategorias(listaCategorias)
  }, [servicios])

  // Al abrir la app: crea las categorias iniciales si hace falta y lee todo una vez.
  useEffect(() => {
    servicios.categorias
      .asegurarIniciales(CATEGORIAS_INICIALES)
      .then(recargar)
      .then(() => setErrorCarga(null))
      .catch((error) => {
        console.error(error)
        setErrorCarga('No se pudieron cargar los datos. Revisa la conexión o la configuración de Firebase.')
      })
      .finally(() => setCargando(false))
  }, [servicios, recargar])

  // Ejecuta una operación del servicio y, si salió bien, vuelve a leer los datos.
  async function ejecutar(operacion) {
    const resultado = await operacion()
    if (resultado.ok) await recargar()
    return resultado
  }

  return {
    tareas,
    categorias,
    hoy,
    cargando,
    errorCarga,
    usaFirebase: firebaseConfigurado,
    crearTarea: (datos) => ejecutar(() => servicios.tareas.crear(datos)),
    editarTarea: (id, cambios) => ejecutar(() => servicios.tareas.editar(id, cambios)),
    cambiarEstado: (id) => ejecutar(() => servicios.tareas.cambiarEstado(id)),
    eliminarTarea: (id) => ejecutar(() => servicios.tareas.eliminar(id)),
    crearCategoria: (datos) => ejecutar(() => servicios.categorias.crear(datos)),
    editarCategoria: (id, cambios) => ejecutar(() => servicios.categorias.editar(id, cambios)),
    eliminarCategoria: (id) => ejecutar(() => servicios.categorias.eliminar(id)),
  }
}
