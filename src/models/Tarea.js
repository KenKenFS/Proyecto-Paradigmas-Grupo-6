// Integrante 2 - Paradigma orientado a objetos.
// Clase Tarea: datos (titulo, descripcion, fechaEntrega AAAA-MM-DD, prioridad,
// estado, categoriaId) y reglas propias (por ejemplo estaVencida(hoy)).
//
// Por que es orientado a objetos:
// - Encapsulamiento: los atributos son privados (#) y solo se leen con getters.
//   Nadie puede cambiar una tarea "por fuera" (tarea.titulo = 'x' no tiene efecto).
// - Comportamiento junto a los datos: la tarea sabe si esta vencida,
//   si esta completada y a que categoria pertenece.
// - Conversion propia: sabe crearse desde Firestore y convertirse a un objeto
//   simple para el resto de la app (React y las funciones puras usan objetos simples).

export const PRIORIDADES = ['baja', 'media', 'alta']
export const ESTADOS = ['pendiente', 'completada']

export class Tarea {
  #id
  #titulo
  #descripcion
  #fechaEntrega
  #prioridad
  #estado
  #categoriaId

  constructor({ id = null, titulo, descripcion = '', fechaEntrega, prioridad = 'media', estado = 'pendiente', categoriaId }) {
    this.#id = id
    this.#titulo = String(titulo ?? '').trim()
    this.#descripcion = String(descripcion ?? '').trim()
    this.#fechaEntrega = fechaEntrega ?? ''
    // Si llega un valor desconocido (por ejemplo, un documento viejo) se usa el valor por defecto.
    this.#prioridad = PRIORIDADES.includes(prioridad) ? prioridad : 'media'
    this.#estado = ESTADOS.includes(estado) ? estado : 'pendiente'
    this.#categoriaId = categoriaId ?? null
  }

  // ---------- Getters (solo lectura) ----------
  get id() { return this.#id }
  get titulo() { return this.#titulo }
  get descripcion() { return this.#descripcion }
  get fechaEntrega() { return this.#fechaEntrega }
  get prioridad() { return this.#prioridad }
  get estado() { return this.#estado }
  get categoriaId() { return this.#categoriaId }

  // ---------- Reglas propias de la tarea ----------
  estaCompletada() {
    return this.#estado === 'completada'
  }

  // "hoy" llega por parametro (AAAA-MM-DD): la clase nunca lee el reloj.
  // Comparar textos AAAA-MM-DD funciona porque el orden alfabetico es el cronologico.
  estaVencida(hoy) {
    return !this.estaCompletada() && this.#fechaEntrega !== '' && this.#fechaEntrega < hoy
  }

  // Relacion con Categoria: una tarea pertenece a una sola categoria.
  perteneceA(categoria) {
    return categoria !== null && categoria !== undefined && this.#categoriaId === categoria.id
  }

  // ---------- Conversiones ----------
  // Datos que se guardan en Firestore (el id es el del documento, no un campo).
  aFirestore() {
    return {
      titulo: this.#titulo,
      descripcion: this.#descripcion,
      fechaEntrega: this.#fechaEntrega,
      prioridad: this.#prioridad,
      estado: this.#estado,
      categoriaId: this.#categoriaId,
    }
  }

  // Objeto simple para React, TareaService y las funciones puras.
  aObjeto() {
    return { id: this.#id, ...this.aFirestore() }
  }

  static desdeFirestore(id, datos) {
    return new Tarea({ ...datos, id })
  }
}
