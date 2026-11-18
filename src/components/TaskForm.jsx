// Integrante 1 - Formulario de tareas (crear y editar).
// El formulario solo junta los datos y muestra el mensaje que devuelve el servicio.
// NO valida aquí: las validaciones (paradigma imperativo) viven en TareaService,
// así hay un solo lugar con las reglas.
import { useState } from 'react'
import './Tareas.css'

const TAREA_VACIA = {
  titulo: '',
  descripcion: '',
  fechaEntrega: '',
  prioridad: 'media',
  categoriaId: '',
}

function TaskForm({ categorias, alGuardar, tareaInicial = null, alCancelar }) {
  const editando = tareaInicial !== null
  const [datos, setDatos] = useState(tareaInicial ?? TAREA_VACIA)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Actualiza el campo que cambió (usa el atributo "name" del input).
  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    setGuardando(true)
    const resultado = await alGuardar(datos)
    setGuardando(false)

    if (!resultado.ok) {
      setError(resultado.error)
      setAviso(null)
      return
    }
    setError(null)
    if (editando) {
      setAviso('Cambios guardados.')
    } else {
      setAviso('Tarea creada.')
      setDatos(TAREA_VACIA)
    }
  }

  return (
    <form className="panel formulario" onSubmit={enviar} noValidate>
      <header className="panel__cabecera">
        <h2>{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
      </header>

      <label className="campo">
        <span>Título</span>
        <input name="titulo" value={datos.titulo} onChange={cambiar} placeholder="Ej. Estudiar para el examen" />
      </label>

      <label className="campo">
        <span>Descripción <small>(opcional)</small></span>
        <textarea name="descripcion" value={datos.descripcion} onChange={cambiar} rows={3} />
      </label>

      <div className="formulario__fila">
        <label className="campo">
          <span>Fecha de entrega</span>
          <input type="date" name="fechaEntrega" value={datos.fechaEntrega} onChange={cambiar} />
        </label>

        <label className="campo">
          <span>Prioridad</span>
          <select name="prioridad" value={datos.prioridad} onChange={cambiar}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>

        <label className="campo">
          <span>Categoría</span>
          <select name="categoriaId" value={datos.categoriaId} onChange={cambiar}>
            <option value="">Seleccione…</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="alerta alerta--error" role="alert">{error}</p>}
      {aviso && <p className="alerta alerta--ok" role="status">{aviso}</p>}

      <div className="formulario__acciones">
        {alCancelar && (
          <button type="button" className="boton boton--secundario" onClick={alCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="boton" disabled={guardando}>
          {editando ? 'Guardar cambios' : 'Crear tarea'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
