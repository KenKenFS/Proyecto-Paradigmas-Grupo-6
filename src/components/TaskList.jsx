// Integrante 1 - Lista de tareas con acciones: completar, editar y eliminar.
// La lista solo muestra los datos y avisa qué botón se presionó; las operaciones
// las hace TareaService (a través de las funciones que recibe por props).
import './Tareas.css'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function textoFecha(fecha) {
  const [, m, d] = fecha.split('-').map(Number)
  return `${d} ${MESES[m - 1]}`
}

function TaskList({ tareas, categorias, hoy, alCambiarEstado, alEditar, alEliminar }) {
  // Pendientes primero (por fecha) y las completadas al final.
  const ordenadas = tareas.toSorted((a, b) => {
    if (a.estado !== b.estado) return a.estado === 'completada' ? 1 : -1
    return a.fechaEntrega.localeCompare(b.fechaEntrega)
  })
  const categoriaDe = (id) => categorias.find((c) => c.id === id)

  async function cambiarEstado(tarea) {
    const resultado = await alCambiarEstado(tarea.id)
    if (!resultado.ok) alert(resultado.error)
  }

  async function eliminar(tarea) {
    if (!confirm(`¿Eliminar la tarea "${tarea.titulo}"? Esta acción no se puede deshacer.`)) return
    const resultado = await alEliminar(tarea.id)
    if (!resultado.ok) alert(resultado.error)
  }

  return (
    <section className="panel">
      <header className="panel__cabecera">
        <h2>Mis tareas</h2>
        <span className="etiqueta">{tareas.length}</span>
      </header>

      {ordenadas.length === 0 && <p className="vacio">Aún no hay tareas. Crea la primera arriba.</p>}

      <ul className="lista">
        {ordenadas.map((t) => {
          const completada = t.estado === 'completada'
          const vencida = !completada && t.fechaEntrega < hoy
          const cat = categoriaDe(t.categoriaId)
          return (
            <li key={t.id} className="lista__item">
              <input
                type="checkbox"
                className="tarea__check"
                checked={completada}
                onChange={() => cambiarEstado(t)}
                aria-label={completada ? `Marcar "${t.titulo}" como pendiente` : `Completar "${t.titulo}"`}
              />
              <div className="lista__texto">
                <strong className={completada ? 'tachado' : ''}>{t.titulo}</strong>
                {t.descripcion && <p className="tarea__descripcion">{t.descripcion}</p>}
                <small>
                  <span className="punto" style={{ background: cat?.color }} aria-hidden="true" /> {cat?.nombre ?? 'Sin categoría'}
                </small>
              </div>
              {vencida && <span className="etiqueta etiqueta--vencida">Vencida</span>}
              <span className={`insignia insignia--${t.prioridad}`}>{t.prioridad}</span>
              <span className={`fecha${vencida ? ' fecha--vencida' : ''}`}>{textoFecha(t.fechaEntrega)}</span>
              <div className="tarea__acciones">
                <button type="button" className="boton boton--chico boton--secundario" onClick={() => alEditar(t)}>
                  Editar
                </button>
                <button type="button" className="boton boton--chico boton--peligro" onClick={() => eliminar(t)}>
                  Eliminar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default TaskList
