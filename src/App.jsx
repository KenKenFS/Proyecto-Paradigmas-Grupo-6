// Integrante 4 - Paradigma declarativo.
// Capa de estado y control: obtiene los datos y los entrega a los componentes.
// La navegacion es por estado (sin router); cada modulo es un componente.
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { MODULOS } from './components/modulos'
import Dashboard from './components/Dashboard'
import Calendario from './components/Calendario'
import Tareas from './components/Tareas'
import Categorias from './components/Categorias'
import Estadisticas from './components/Estadisticas'
import { useTareas } from './hooks/useTareas'
import './App.css'

const SUBTITULOS = {
  dashboard: 'Un vistazo a tu progreso',
  tareas: 'Crea y administra tus tareas',
  categorias: 'Organiza tus tareas por categoría',
  calendario: 'Tus fechas de entrega del mes',
  estadisticas: 'Filtros, búsqueda y productividad',
}

// "hoy" (AAAA-MM-DD) a texto, por ejemplo "martes, 24 de noviembre".
function fechaLarga(hoy) {
  const [a, m, d] = hoy.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function App() {
  const [modulo, setModulo] = useState('dashboard')
  const {
    tareas, categorias, hoy, cargando, errorCarga, usaFirebase,
    crearTarea, editarTarea, cambiarEstado, eliminarTarea,
    crearCategoria, editarCategoria, eliminarCategoria,
  } = useTareas()
  const actual = MODULOS.find((m) => m.id === modulo)
  const datos = { tareas, categorias, hoy }

  const pantallas = {
    dashboard: <Dashboard {...datos} alIrACalendario={() => setModulo('calendario')} />,
    tareas: (
      <Tareas
        {...datos}
        crearTarea={crearTarea}
        editarTarea={editarTarea}
        cambiarEstado={cambiarEstado}
        eliminarTarea={eliminarTarea}
      />
    ),
    categorias: (
      <Categorias
        {...datos}
        crearCategoria={crearCategoria}
        editarCategoria={editarCategoria}
        eliminarCategoria={eliminarCategoria}
      />
    ),
    calendario: <Calendario {...datos} />,
    estadisticas: <Estadisticas {...datos} />,
  }

  return (
    <div className="app">
      <Sidebar activo={modulo} alCambiar={setModulo} />
      <main className="contenido">
        <header className="contenido__cabecera">
          <div>
            <h1>{actual.etiqueta}</h1>
            {SUBTITULOS[modulo] && <p>{SUBTITULOS[modulo]}</p>}
          </div>
          <p className="contenido__fecha capitalizar">{fechaLarga(hoy)}</p>
        </header>
        {!usaFirebase && (
          <p className="alerta alerta--aviso" role="status">
            Modo de prueba: sin <code>.env.local</code> los datos se guardan solo en memoria y se pierden al recargar.
          </p>
        )}
        {errorCarga && <p className="alerta alerta--error" role="alert">{errorCarga}</p>}
        {cargando ? (
          <p className="vacio">Cargando…</p>
        ) : (
          // La "key" hace que cada cambio de modulo repita la animacion de entrada.
          <div key={modulo} className="pantalla">{pantallas[modulo] ?? null}</div>
        )}
      </main>
    </div>
  )
}

export default App
