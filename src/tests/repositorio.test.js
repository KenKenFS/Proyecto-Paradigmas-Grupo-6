// Pruebas del repositorio de Firestore (Integrante 2).
// Firestore se simula con vi.mock: se revisa que los documentos se conviertan
// con las clases Tarea/Categoria y que se llame a la coleccion correcta.
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, nombre) => ({ nombre })),
  doc: vi.fn((_db, nombre, id) => ({ nombre, id })),
  getDocs: vi.fn(),
  addDoc: vi.fn(async () => ({ id: 'nuevo' })),
  updateDoc: vi.fn(async () => {}),
  deleteDoc: vi.fn(async () => {}),
}))

const firestore = await import('firebase/firestore')
const { crearRepositorioFirestore } = await import('../data/repositorio')

function documento(id, datos) {
  return { id, data: () => datos }
}

describe('repositorio de Firestore', () => {
  let repo
  beforeEach(() => {
    vi.clearAllMocks()
    repo = crearRepositorioFirestore({})
  })

  it('convierte los documentos de tareas a objetos simples con id', async () => {
    firestore.getDocs.mockResolvedValueOnce({
      docs: [documento('t1', { titulo: 'A', fechaEntrega: '2026-11-20', prioridad: 'alta', estado: 'pendiente', categoriaId: 'c1' })],
    })
    const tareas = await repo.obtenerTareas()
    expect(tareas).toEqual([
      { id: 't1', titulo: 'A', descripcion: '', fechaEntrega: '2026-11-20', prioridad: 'alta', estado: 'pendiente', categoriaId: 'c1' },
    ])
  })

  it('devuelve las categorías ordenadas por nombre', async () => {
    firestore.getDocs.mockResolvedValueOnce({
      docs: [documento('c2', { nombre: 'Trabajo', color: '#000000' }), documento('c1', { nombre: 'Hogar', color: '#ffffff' })],
    })
    expect((await repo.obtenerCategorias()).map((c) => c.nombre)).toEqual(['Hogar', 'Trabajo'])
  })

  it('guarda una tarea en la colección "tareas" sin el campo id', async () => {
    const id = await repo.guardarTarea({ id: 'ignorar', titulo: 'B', fechaEntrega: '2026-11-21', prioridad: 'baja', categoriaId: 'c1' })
    expect(id).toBe('nuevo')
    const [ref, datos] = firestore.addDoc.mock.calls[0]
    expect(ref).toEqual({ nombre: 'tareas' })
    expect(datos).not.toHaveProperty('id')
    expect(datos.estado).toBe('pendiente')
  })

  it('actualiza y elimina el documento correcto', async () => {
    await repo.actualizarCategoria('c1', { nombre: 'X', color: '#000000' })
    expect(firestore.updateDoc).toHaveBeenCalledWith({ nombre: 'categorias', id: 'c1' }, { nombre: 'X', color: '#000000' })
    await repo.eliminarTarea('t1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith({ nombre: 'tareas', id: 't1' })
  })
})
