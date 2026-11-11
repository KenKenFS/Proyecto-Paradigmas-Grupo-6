// Declarativo: describe la barra de navegacion segun el modulo activo.
// En pantallas pequenas se convierte en una barra inferior (ver App.css).
import { MODULOS } from './modulos'

function Sidebar({ activo, alCambiar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__marca">
        {/* Marca: una casilla cuyo visto se sale del borde, como al marcar a mano. */}
        <svg className="sidebar__logo" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="3" y="7" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M9 17.5 14 22.5 29 4" fill="none" stroke="var(--acento)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <strong>Gestor de Tareas</strong>
          <small>Productividad</small>
        </div>
      </div>

      <nav aria-label="Módulos" className="sidebar__nav">
        {MODULOS.map(({ id, etiqueta, Icono }) => (
          <button
            key={id}
            type="button"
            className={`sidebar__item${activo === id ? ' sidebar__item--activo' : ''}`}
            aria-current={activo === id ? 'page' : undefined}
            onClick={() => alCambiar(id)}
          >
            <Icono />
            <span>{etiqueta}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
