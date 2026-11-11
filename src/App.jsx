// Integrante 4 - Paradigma declarativo.
// Capa de estado y control: obtiene los datos y los entrega a los componentes.
// La navegacion es por estado (sin router); cada modulo es un componente.
// Tareas, Categorias y Estadisticas quedan vacios hasta que sus responsables los construyan.
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { MODULOS } from './components/modulos'
import Dashboard from './components/Dashboard'
import Calendario from './components/Calendario'
import { useTareas } from './hooks/useTareas'
import './App.css'

const SUBTITULOS = {
  dashboard: 'Un vistazo a tu progreso',
  calendario: 'Tus fechas de entrega del mes',
}

function App() {
  const [modulo, setModulo] = useState('dashboard')
  const { tareas, categorias, hoy } = useTareas()
  const actual = MODULOS.find((m) => m.id === modulo)

  const pantallas = {
    dashboard: (
      <Dashboard tareas={tareas} categorias={categorias} hoy={hoy} alIrACalendario={() => setModulo('calendario')} />
    ),
    calendario: <Calendario tareas={tareas} categorias={categorias} hoy={hoy} />,
  }

  return (
    <div className="app">
      <Sidebar activo={modulo} alCambiar={setModulo} />
      <main className="contenido">
        <header className="contenido__cabecera">
          <h1>{actual.etiqueta}</h1>
          {SUBTITULOS[modulo] && <p>{SUBTITULOS[modulo]}</p>}
        </header>
        {pantallas[modulo] ?? null}
      </main>
    </div>
  )
}

export default App
