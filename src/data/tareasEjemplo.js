// Datos de ejemplo mientras Firestore no existe (Integrante 2 los reemplaza
// con data/repositorio.js). Las fechas son relativas a "hoy" para que el
// calendario siempre se vea poblado. Formato de fecha: AAAA-MM-DD (riesgo 6).

export function formatearFecha(fecha) {
  const a = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${a}-${m}-${d}`
}

export function sumarDias(hoy, dias) {
  const [a, m, d] = hoy.split('-').map(Number)
  return formatearFecha(new Date(a, m - 1, d + dias))
}

export const categoriasEjemplo = [
  { id: 'c1', nombre: 'Universidad', color: '#6366f1' },
  { id: 'c2', nombre: 'Trabajo', color: '#0ea5e9' },
  { id: 'c3', nombre: 'Personal', color: '#10b981' },
  { id: 'c4', nombre: 'Hogar', color: '#f59e0b' },
]

export function crearTareasEjemplo(hoy) {
  const t = (id, titulo, descripcion, dias, prioridad, estado, categoriaId) => ({
    id,
    titulo,
    descripcion,
    fechaEntrega: sumarDias(hoy, dias),
    prioridad,
    estado,
    categoriaId,
  })
  return [
    t('t1', 'Entregar avance del proyecto final', 'Subir el ZIP con capturas y explicación técnica.', 2, 'alta', 'pendiente', 'c1'),
    t('t2', 'Estudiar para el examen de Paradigmas', 'Repasar funcional, OO e imperativo.', 5, 'alta', 'pendiente', 'c1'),
    t('t3', 'Reunión de equipo del grupo 6', 'Repartir ramas y revisar los commits.', 0, 'media', 'pendiente', 'c1'),
    t('t4', 'Informe semanal', 'Resumen de avances para el supervisor.', 1, 'media', 'pendiente', 'c2'),
    t('t5', 'Revisar pull request', 'Revisión mutua antes de integrar a main.', 3, 'media', 'pendiente', 'c2'),
    t('t6', 'Pagar el recibo de la luz', '', -2, 'alta', 'pendiente', 'c4'),
    t('t7', 'Comprar víveres', 'Lista en el refrigerador.', 4, 'baja', 'pendiente', 'c4'),
    t('t8', 'Ir al gimnasio', 'Rutina de piernas.', 0, 'baja', 'completada', 'c3'),
    t('t9', 'Leer capítulo de Sebesta', 'Capítulo sobre paradigmas.', -1, 'media', 'completada', 'c1'),
    t('t10', 'Cita con el dentista', '', 8, 'media', 'pendiente', 'c3'),
    t('t11', 'Configurar Firebase del grupo', 'Crear Firestore y compartir llaves.', -4, 'alta', 'completada', 'c2'),
    t('t12', 'Limpiar el garaje', '', 11, 'baja', 'pendiente', 'c4'),
    t('t13', 'Preparar presentación de la defensa', 'Diapositivas y demo.', 14, 'alta', 'pendiente', 'c1'),
    t('t14', 'Llamar a la abuela', '', 6, 'baja', 'pendiente', 'c3'),
  ]
}
