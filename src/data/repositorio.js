// Integrante 2 - Unica capa que habla con Firestore.
// Lee y escribe documentos de las colecciones "tareas" y "categorias".
//
// Cada documento se convierte en un objeto de la clase Tarea o Categoria
// (models/) y de ahi a un objeto simple para el resto de la app. Asi la forma
// de los datos se define en un solo lugar: las clases.
//
// Tiene los mismos metodos que data/repositorioMemoria.js, por eso TareaService
// y CategoriaService funcionan igual con cualquiera de los dos.
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { Tarea } from '../models/Tarea'
import { Categoria } from '../models/Categoria'

export function crearRepositorioFirestore(db) {
  const tareasRef = collection(db, 'tareas')
  const categoriasRef = collection(db, 'categorias')

  return {
    // ---------- Tareas ----------
    async obtenerTareas() {
      const resultado = await getDocs(tareasRef)
      return resultado.docs.map((d) => Tarea.desdeFirestore(d.id, d.data()).aObjeto())
    },
    async guardarTarea(datos) {
      const ref = await addDoc(tareasRef, new Tarea(datos).aFirestore())
      return ref.id
    },
    async actualizarTarea(id, datos) {
      await updateDoc(doc(db, 'tareas', id), new Tarea(datos).aFirestore())
    },
    async eliminarTarea(id) {
      await deleteDoc(doc(db, 'tareas', id))
    },

    // ---------- Categorias ----------
    async obtenerCategorias() {
      const resultado = await getDocs(categoriasRef)
      return resultado.docs
        .map((d) => Categoria.desdeFirestore(d.id, d.data()).aObjeto())
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    },
    async guardarCategoria(datos) {
      const ref = await addDoc(categoriasRef, new Categoria(datos).aFirestore())
      return ref.id
    },
    async actualizarCategoria(id, datos) {
      await updateDoc(doc(db, 'categorias', id), new Categoria(datos).aFirestore())
    },
    async eliminarCategoria(id) {
      await deleteDoc(doc(db, 'categorias', id))
    },
  }
}
