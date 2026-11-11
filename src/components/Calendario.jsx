// Declarativo: el calendario se describe con una lista de eventos y opciones,
// sin indicar el procedimiento paso a paso. Solo lee las tareas (no las modifica).
import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { tareasAEventos } from '../funcional/tareasAEventos'
import { formatearFecha } from '../data/tareasEjemplo'

const NOMBRE_ESTADO = { pendiente: 'Pendiente', completada: 'Completada' }

function formatoLargo(fecha) {
  const [a, m, d] = fecha.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function Calendario({ tareas, categorias, hoy }) {
  const [seleccion, setSeleccion] = useState(hoy)
  const eventos = useMemo(() => tareasAEventos(tareas, hoy), [tareas, hoy])
  const delDia = tareas.filter((t) => t.fechaEntrega === seleccion)
  const categoriaDe = (id) => categorias.find((c) => c.id === id)

  return (
    <div className="calendario">
      <section className="panel panel--calendario">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          firstDay={1}
          height="auto"
          fixedWeekCount={false}
          events={eventos}
          dayMaxEvents={3}
          moreLinkText={(n) => `+${n} más`}
          headerToolbar={{ left: 'title', right: 'today prev,next' }}
          buttonText={{ today: 'Hoy' }}
          dateClick={(info) => setSeleccion(info.dateStr)}
          eventClick={(info) => setSeleccion(info.event.startStr)}
          dayCellClassNames={(arg) =>
            formatearFecha(arg.date) === seleccion ? ['dia-seleccionado'] : []
          }
          dayCellDidMount={(arg) => {
            // Accesibilidad: cada dia se puede alcanzar y activar con el teclado.
            arg.el.tabIndex = 0
            arg.el.setAttribute('role', 'button')
            arg.el.setAttribute('aria-label', arg.date.toLocaleDateString('es-CR', { dateStyle: 'full' }))
            arg.el.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSeleccion(formatearFecha(arg.date))
              }
            })
          }}
        />
        <ul className="leyenda" aria-label="Leyenda de prioridad">
          <li><span className="punto punto--alta" /> Alta</li>
          <li><span className="punto punto--media" /> Media</li>
          <li><span className="punto punto--baja" /> Baja</li>
          <li><span className="punto punto--vencida" /> Vencida</li>
        </ul>
      </section>

      <aside className="panel panel--detalle" aria-label="Tareas del día">
        <header className="panel__cabecera" aria-live="polite">
          <div>
            <p className="panel__sobre">{seleccion === hoy ? 'Hoy' : 'Día seleccionado'}</p>
            <h2 className="capitalizar">{formatoLargo(seleccion)}</h2>
          </div>
        </header>
        {delDia.length === 0 ? (
          <p className="vacio">Sin tareas para este día.</p>
        ) : (
          <ul className="lista">
            {delDia.map((t) => {
              const cat = categoriaDe(t.categoriaId)
              const vencida = t.estado !== 'completada' && t.fechaEntrega < hoy
              return (
                <li key={t.id} className="detalle">
                  <div className="detalle__fila">
                    <span className="punto" style={{ background: cat?.color }} aria-hidden="true" />
                    <strong className={t.estado === 'completada' ? 'tachado' : ''}>{t.titulo}</strong>
                  </div>
                  {t.descripcion && <p className="detalle__desc">{t.descripcion}</p>}
                  <div className="detalle__etiquetas">
                    <span className={`insignia insignia--${t.prioridad}`}>{t.prioridad}</span>
                    <span className="etiqueta">{cat?.nombre}</span>
                    <span className={`etiqueta${vencida ? ' etiqueta--vencida' : ''}`}>
                      {vencida ? 'Vencida' : NOMBRE_ESTADO[t.estado]}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
    </div>
  )
}

export default Calendario
