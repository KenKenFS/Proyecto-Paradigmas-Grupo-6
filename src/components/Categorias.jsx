// Integrante 2 - Pantalla del modulo de Categorias.
// Formulario para crear/editar y lista con la cantidad de tareas de cada una
// (relacion uno a muchos, calculada por la clase Categoria).
// Las validaciones viven en Categoria / CategoriaService, no aqui.
import { useEffect, useState } from 'react'
import { Categoria } from '../models/Categoria'
import './Tareas.css'

// Colores sugeridos: apagados, para combinar con la paleta de la app.
const COLORES = [
  { valor: '#4f5f47', nombre: 'Oliva' },
  { valor: '#6f8566', nombre: 'Salvia' },
  { valor: '#5d7a8c', nombre: 'Azul' },
  { valor: '#7d8da0', nombre: 'Gris azulado' },
  { valor: '#7a6a55', nombre: 'Café' },
  { valor: '#b48a3c', nombre: 'Mostaza' },
  { valor: '#a4503a', nombre: 'Terracota' },
  { valor: '#8c5a7a', nombre: 'Ciruela' },
]

const CATEGORIA_VACIA = { nombre: '', color: COLORES[0].valor }

function FormularioCategoria({ inicial, alGuardar, alCancelar }) {
  const editando = inicial !== null
  const [datos, setDatos] = useState(inicial ?? CATEGORIA_VACIA)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const colorLibre = !COLORES.some((c) => c.valor === datos.color.toLowerCase())

  useEffect(() => {
    if (!aviso) return
    const temporizador = setTimeout(() => setAviso(null), 3000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  function cambiar(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    setGuardando(true)
    let resultado
    try {
      resultado = await alGuardar({ nombre: datos.nombre, color: datos.color })
    } catch {
      resultado = { ok: false, error: 'No se pudo guardar. Intente de nuevo.' }
    }
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
      setAviso('Categoría creada.')
      setDatos(CATEGORIA_VACIA)
    }
  }

  return (
    <form className="panel formulario" onSubmit={enviar} noValidate>
      <header className="panel__cabecera">
        <h2>{editando ? 'Editar categoría' : 'Nueva categoría'}</h2>
      </header>

      <label className="campo">
        <span>Nombre</span>
        <input name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej. Universidad" />
      </label>

      <fieldset className="colores">
        <legend>Color</legend>
        {COLORES.map((c) => (
          <label key={c.valor} className="color" title={c.nombre}>
            <input
              type="radio"
              name="color"
              value={c.valor}
              checked={datos.color.toLowerCase() === c.valor}
              onChange={cambiar}
              aria-label={c.nombre}
            />
            <span style={{ background: c.valor }} />
          </label>
        ))}
        <label className="color color--libre" title="Otro color">
          <input type="color" name="color" value={datos.color} onChange={cambiar} aria-label="Otro color" />
          <span style={colorLibre ? { background: datos.color, boxShadow: '0 0 0 2px var(--superficie), 0 0 0 4px var(--texto)' } : undefined} />
        </label>
      </fieldset>

      {error && <p className="alerta alerta--error" role="alert">{error}</p>}
      {aviso && <p className="alerta alerta--ok" role="status">{aviso}</p>}

      <div className="formulario__acciones">
        {alCancelar && (
          <button type="button" className="boton boton--secundario" onClick={alCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="boton" disabled={guardando}>
          {editando ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </div>
    </form>
  )
}

function Categorias({ tareas, categorias, crearCategoria, editarCategoria, eliminarCategoria }) {
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)

  async function guardarEdicion(datos) {
    const resultado = await editarCategoria(editando.id, datos)
    if (resultado.ok) setEditando(null)
    return resultado
  }

  async function eliminar(categoria) {
    setError(null)
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`)) return
    const resultado = await eliminarCategoria(categoria.id)
    if (!resultado.ok) setError(resultado.error)
  }

  return (
    <div className="tareas">
      {editando ? (
        <FormularioCategoria
          key={editando.id}
          inicial={editando}
          alGuardar={guardarEdicion}
          alCancelar={() => setEditando(null)}
        />
      ) : (
        <FormularioCategoria key="nueva" inicial={null} alGuardar={crearCategoria} />
      )}

      <section className="panel">
        <header className="panel__cabecera">
          <h2>Mis categorías</h2>
          <span className="etiqueta">{categorias.length}</span>
        </header>

        {error && <p className="alerta alerta--error" role="alert">{error}</p>}
        {categorias.length === 0 && <p className="vacio">Aún no hay categorías. Crea la primera arriba.</p>}

        <ul className="lista">
          {categorias.map((datos) => {
            const categoria = new Categoria(datos)
            const total = categoria.contarTareas(tareas)
            const pendientes = categoria.tareasDe(tareas).filter((t) => t.estado !== 'completada').length
            const avance = total === 0 ? 0 : Math.round(((total - pendientes) / total) * 100)
            return (
              <li key={categoria.id} className="lista__item">
                <span className="punto" style={{ background: categoria.color, width: 12, height: 12 }} aria-hidden="true" />
                <div className="lista__texto">
                  <strong>{categoria.nombre}</strong>
                  <small>
                    {total} {total === 1 ? 'tarea' : 'tareas'} · {pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'}
                  </small>
                </div>
                <div
                  className="categoria__avance"
                  role="progressbar"
                  aria-label={`Avance de ${categoria.nombre}`}
                  aria-valuenow={avance}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  title={`${avance}% completado`}
                >
                  <div style={{ width: `${avance}%`, background: categoria.color }} />
                </div>
                <div className="tarea__acciones">
                  <button
                    type="button"
                    className="boton boton--chico boton--secundario"
                    onClick={() => {
                      setError(null)
                      setEditando(categoria.aObjeto())
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="boton boton--chico boton--peligro"
                    onClick={() => eliminar(categoria)}
                    title={categoria.puedeEliminarse(tareas) ? undefined : 'Tiene tareas asociadas'}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default Categorias
