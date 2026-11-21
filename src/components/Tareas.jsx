// Integrante 1 - Pantalla del modulo de Tareas.
// Une el formulario (TaskForm) y la lista (TaskList), y recuerda cuál tarea
// se está editando. Las operaciones llegan por props desde useTareas.
import { useState } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

function Tareas({ tareas, categorias, hoy, crearTarea, editarTarea, cambiarEstado, eliminarTarea }) {
  const [editando, setEditando] = useState(null)

  function empezarEdicion(tarea) {
    setEditando(tarea)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function guardarEdicion(datos) {
    const resultado = await editarTarea(editando.id, datos)
    if (resultado.ok) setEditando(null)
    return resultado
  }

  return (
    <div className="tareas">
      {editando ? (
        <TaskForm
          key={editando.id}
          categorias={categorias}
          tareaInicial={editando}
          alGuardar={guardarEdicion}
          alCancelar={() => setEditando(null)}
        />
      ) : (
        <TaskForm key="nueva" categorias={categorias} alGuardar={crearTarea} />
      )}

      <TaskList
        tareas={tareas}
        categorias={categorias}
        hoy={hoy}
        alCambiarEstado={cambiarEstado}
        alEditar={empezarEdicion}
        alEliminar={eliminarTarea}
      />
    </div>
  )
}

export default Tareas
