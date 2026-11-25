// Integrante 2 - Configuracion de Firebase Firestore.
// Las llaves viven en .env.local (ver .env.example). No subirlas al repo.
//
// Si un integrante no tiene .env.local, "firebaseConfigurado" es false y la app
// usa el repositorio en memoria (data/repositorioMemoria.js) en lugar de fallar.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let db = null

// Crea la conexion la primera vez que se pide (y solo si hay llaves).
export function obtenerDb() {
  if (!firebaseConfigurado) {
    throw new Error('Firebase no está configurado: falta .env.local (ver .env.example).')
  }
  if (db === null) {
    db = getFirestore(initializeApp(firebaseConfig))
  }
  return db
}
