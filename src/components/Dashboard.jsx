// Declarativo: el dashboard describe que mostrar segun la lista de tareas.
// Solo lee los datos; no los modifica.
import { sumarDias } from '../data/tareasEjemplo'

// TODO (Integrante 3): reemplazar por calcularEstadisticas(tareas, hoy)
// de funcional/estadisticas.js cuando exista.
function resumir(tareas, hoy) {
  const completadas = tareas.filter((t) => t.estado === 'completada').length
  const vencidas = tareas.filter((t) => t.estado !== 'completada' && t.fechaEntrega < hoy).length
  const enCurso = tareas.length - completadas - vencidas
  const porcentaje = tareas.length ? Math.round((completadas / tareas.length) * 100) : 0
  return { completadas, vencidas, enCurso, porcentaje, total: tareas.length }
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function textoFecha(fecha, hoy) {
  if (fecha === hoy) return 'Hoy'
  if (fecha === sumarDias(hoy, 1)) return 'Mañana'
  if (fecha === sumarDias(hoy, -1)) return 'Ayer'
  const [, m, d] = fecha.split('-').map(Number)
  return `${d} ${MESES[m - 1]}`
}

function Dashboard({ tareas, categorias, hoy, alIrACalendario }) {
  const r = resumir(tareas, hoy)
  const proximas = tareas
    .filter((t) => t.estado !== 'completada')
    .toSorted((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega))
    .slice(0, 5)
  const porCategoria = categorias.map((c) => ({
    ...c,
    total: tareas.filter((t) => t.categoriaId === c.id).length,
  }))
  const maximo = Math.max(1, ...porCategoria.map((c) => c.total))
  const nombreDe = (id) => categorias.find((c) => c.id === id)

  // Cada tarea es una marca; se agrupan en el orden en que se resuelven.
  const grupos = [
    { id: 'hechas', etiqueta: 'Completadas', n: r.completadas },
    { id: 'curso', etiqueta: 'En curso', n: r.enCurso },
    { id: 'vencidas', etiqueta: 'Vencidas', n: r.vencidas },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard__principal">
        <section className="panel">
          <header className="panel__cabecera">
            <h2>Próximas entregas</h2>
            <button type="button" className="enlace" onClick={alIrACalendario}>
              Ver calendario →
            </button>
          </header>
          {proximas.length === 0 && <p className="vacio">No tienes entregas pendientes.</p>}
          <ul className="lista">
            {proximas.map((t) => {
              const vencida = t.fechaEntrega < hoy
              const cat = nombreDe(t.categoriaId)
              return (
                <li key={t.id} className="lista__item">
                  <span className="punto" style={{ background: cat?.color }} aria-hidden="true" />
                  <div className="lista__texto">
                    <strong>{t.titulo}</strong>
                    <small>{cat?.nombre}</small>
                  </div>
                  <span className={`insignia insignia--${t.prioridad}`}>{t.prioridad}</span>
                  <span className={`fecha${vencida ? ' fecha--vencida' : ''}`}>
                    {textoFecha(t.fechaEntrega, hoy)}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="panel">
          <header className="panel__cabecera">
            <h2>Tareas por categoría</h2>
          </header>
          {porCategoria.length === 0 && <p className="vacio">Aún no hay categorías.</p>}
          <ul className="barras">
            {porCategoria.map((c) => (
              <li key={c.id}>
                <div className="barras__fila">
                  <span>{c.nombre}</span>
                  <strong>{c.total}</strong>
                </div>
                <div
                  className="barras__pista"
                  role="progressbar"
                  aria-label={`Tareas en ${c.nombre}`}
                  aria-valuenow={c.total}
                  aria-valuemin="0"
                  aria-valuemax={maximo}
                >
                  <div
                    className="barras__relleno"
                    style={{ width: `${(c.total / maximo) * 100}%`, background: c.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="panel estado" aria-label="Resumen de tareas">
        <p className="estado__sobre">Tus {r.total} tareas</p>
        <p className="estado__porcentaje">{r.porcentaje}<small>%</small></p>
        <p className="estado__nota">de avance</p>

        <div
          className="estado__tira"
          role="img"
          aria-label={`${r.completadas} completadas, ${r.enCurso} en curso y ${r.vencidas} vencidas`}
        >
          {grupos.flatMap((g) =>
            Array.from({ length: g.n }, (_, i) => (
              <i key={`${g.id}-${i}`} className={`marca marca--${g.id}`} />
            )),
          )}
        </div>

        <ul className="estado__lista">
          {grupos.map((g) => (
            <li key={g.id}>
              <i className={`marca marca--${g.id} marca--leyenda`} aria-hidden="true" />
              <span>{g.etiqueta}</span>
              <strong>{g.n}</strong>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default Dashboard
