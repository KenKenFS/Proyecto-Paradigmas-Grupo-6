// Integrante 3 - Paradigma funcional (capa de presentacion).
// Usa filtrarTareas y calcularEstadisticas; solo lee datos, no los modifica.
import { useState } from 'react'
import { filtrarTareas } from '../funcional/filtros'
import {
  calcularEstadisticas,
  contarPorCategoria,
  contarPorPrioridad,
} from '../funcional/estadisticas'
import { sumarDias } from '../data/tareasEjemplo'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const CRITERIOS_VACIOS = {
  texto: '',
  estado: '',
  categoriaId: '',
  prioridad: '',
}

function textoFecha(fecha, hoy) {
  if (fecha === hoy) return 'Hoy'
  if (fecha === sumarDias(hoy, 1)) return 'Mañana'
  if (fecha === sumarDias(hoy, -1)) return 'Ayer'
  const [, m, d] = fecha.split('-').map(Number)
  return `${d} ${MESES[m - 1]}`
}

function etiquetaEstado(tarea, hoy) {
  if (tarea.estado === 'completada') return 'Completada'
  if (tarea.fechaEntrega && tarea.fechaEntrega < hoy) return 'Vencida'
  return 'Pendiente'
}

function Estadisticas({ tareas, categorias, hoy }) {
  const [criterios, setCriterios] = useState(CRITERIOS_VACIOS)

  const filtradas = filtrarTareas(tareas, criterios)
  const stats = calcularEstadisticas(filtradas, hoy)
  const statsGlobales = calcularEstadisticas(tareas, hoy)
  const porPrioridad = contarPorPrioridad(filtradas)
  const porCategoria = contarPorCategoria(filtradas)

  const nombreDe = (id) => categorias.find((c) => c.id === id)
  const totalFiltrado = filtradas.length
  const maxPrioridad = Math.max(1, porPrioridad.alta, porPrioridad.media, porPrioridad.baja)

  const grupos = [
    { id: 'hechas', etiqueta: 'Completadas', n: stats.completadas },
    { id: 'curso', etiqueta: 'Pendientes', n: stats.pendientes },
    { id: 'vencidas', etiqueta: 'Vencidas', n: stats.vencidas },
  ]

  const hayFiltros = Object.values(criterios).some((valor) => valor !== '')

  function actualizar(campo, valor) {
    setCriterios((prev) => ({ ...prev, [campo]: valor }))
  }

  function limpiarFiltros() {
    setCriterios(CRITERIOS_VACIOS)
  }

  return (
    <div className="estadisticas">
      <div className="estadisticas__principal">
        <section className="panel" aria-label="Búsqueda y filtros">
          <header className="panel__cabecera">
            <h2>Búsqueda y filtros</h2>
            {hayFiltros && (
              <button type="button" className="enlace" onClick={limpiarFiltros}>
                Limpiar
              </button>
            )}
          </header>

          <div className="formulario estadisticas__filtros">
            <label className="campo">
              Buscar por nombre
              <input
                type="search"
                value={criterios.texto}
                onChange={(e) => actualizar('texto', e.target.value)}
                placeholder="Ej. examen, informe…"
                autoComplete="off"
              />
            </label>

            <div className="estadisticas__fila">
              <label className="campo">
                Estado
                <select
                  value={criterios.estado}
                  onChange={(e) => actualizar('estado', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                </select>
              </label>

              <label className="campo">
                Prioridad
                <select
                  value={criterios.prioridad}
                  onChange={(e) => actualizar('prioridad', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </label>

              <label className="campo">
                Categoría
                <select
                  value={criterios.categoriaId}
                  onChange={(e) => actualizar('categoriaId', e.target.value)}
                >
                  <option value="">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="panel">
          <header className="panel__cabecera">
            <h2>Resultados</h2>
            <span className="etiqueta">
              {totalFiltrado === 1 ? '1 tarea' : `${totalFiltrado} tareas`}
              {hayFiltros ? ' filtradas' : ''}
            </span>
          </header>

          {filtradas.length === 0 && (
            <p className="vacio">
              {tareas.length === 0
                ? 'Aún no hay tareas para analizar.'
                : 'Ninguna tarea coincide con los filtros.'}
            </p>
          )}

          <ul className="lista">
            {filtradas.map((t) => {
              const cat = nombreDe(t.categoriaId)
              const vencida = t.estado !== 'completada' && t.fechaEntrega < hoy
              return (
                <li key={t.id} className="lista__item">
                  <span
                    className="punto"
                    style={{ background: cat?.color }}
                    aria-hidden="true"
                  />
                  <div className="lista__texto">
                    <strong className={t.estado === 'completada' ? 'tachado' : ''}>
                      {t.titulo}
                    </strong>
                    <small>
                      {cat?.nombre ?? 'Sin categoría'}
                      {' · '}
                      {etiquetaEstado(t, hoy)}
                    </small>
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
            <h2>Por prioridad</h2>
          </header>
          {filtradas.length === 0 && <p className="vacio">Sin datos para mostrar.</p>}
          <ul className="barras">
            {(['alta', 'media', 'baja']).map((nivel) => (
              <li key={nivel}>
                <div className="barras__fila">
                  <span className="capitalizar">{nivel}</span>
                  <strong>{porPrioridad[nivel]}</strong>
                </div>
                <div
                  className="barras__pista"
                  role="progressbar"
                  aria-label={`Tareas de prioridad ${nivel}`}
                  aria-valuenow={porPrioridad[nivel]}
                  aria-valuemin="0"
                  aria-valuemax={maxPrioridad}
                >
                  <div
                    className={`barras__relleno barras__relleno--${nivel}`}
                    style={{ width: `${(porPrioridad[nivel] / maxPrioridad) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <header className="panel__cabecera">
            <h2>Por categoría</h2>
          </header>
          {categorias.length === 0 && <p className="vacio">Aún no hay categorías.</p>}
          <ul className="barras">
            {categorias.map((c) => {
              const total = porCategoria[c.id] ?? 0
              const maxCat = Math.max(
                1,
                ...categorias.map((cat) => porCategoria[cat.id] ?? 0),
              )
              return (
                <li key={c.id}>
                  <div className="barras__fila">
                    <span>{c.nombre}</span>
                    <strong>{total}</strong>
                  </div>
                  <div
                    className="barras__pista"
                    role="progressbar"
                    aria-label={`Tareas en ${c.nombre}`}
                    aria-valuenow={total}
                    aria-valuemin="0"
                    aria-valuemax={maxCat}
                  >
                    <div
                      className="barras__relleno"
                      style={{ width: `${(total / maxCat) * 100}%`, background: c.color }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <aside className="panel estado" aria-label="Resumen de productividad">
        <p className="estado__sobre">
          {hayFiltros
            ? `De ${totalFiltrado} filtradas`
            : `Tus ${tareas.length} tareas`}
        </p>
        <p className="estado__porcentaje">
          {stats.porcentaje}
          <small>%</small>
        </p>
        <p className="estado__nota">de productividad</p>

        <div
          className="estado__tira"
          role="img"
          aria-label={`${stats.completadas} completadas, ${stats.pendientes} pendientes y ${stats.vencidas} vencidas`}
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

        {hayFiltros && (
          <p className="nota">
            Global: {statsGlobales.porcentaje}% · {statsGlobales.completadas} hechas ·{' '}
            {statsGlobales.pendientes} pendientes · {statsGlobales.vencidas} vencidas
          </p>
        )}
      </aside>
    </div>
  )
}

export default Estadisticas
