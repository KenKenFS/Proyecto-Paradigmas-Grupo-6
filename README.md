# Gestor de Tareas y Productividad

Proyecto del curso **SC-250 Paradigmas de Programación — Grupo 6**.

Aplicación web para organizar tareas por categoría, con fechas de entrega, prioridades, calendario mensual y estadísticas de productividad. Cada parte del sistema está construida con un paradigma de programación distinto (imperativo, orientado a objetos, funcional y declarativo).

**Tecnologías:** React 19 · Vite · Firebase Firestore · FullCalendar · Vitest · oxlint

---

## Requisitos

- [Node.js](https://nodejs.org/) **22 LTS o superior** (incluye `npm`). Para revisar la versión: `node -v`
- [Git](https://git-scm.com/)
- Acceso al proyecto de Firebase del grupo (para usar la base de datos real)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/KenKenFS/Proyecto-Paradigmas-Grupo-6.git
cd Proyecto-Paradigmas-Grupo-6
```

### 2. Instalar las dependencias

```bash
npm install
```

Esto crea la carpeta `node_modules` (no se sube al repositorio). Hay que hacerlo una vez después de clonar y cada vez que cambie `package.json`.

### 3. Configurar Firebase (`.env.local`)

Las llaves de Firebase **no están en el repositorio**. Cada integrante debe crear su propio archivo `.env.local` en la raíz del proyecto (junto a `package.json`):

```bash
# Windows (Command Prompt)
copy .env.example .env.local

# Git Bash / macOS / Linux
cp .env.example .env.local
```

Luego se completan los valores que faltan. Se obtienen en la [consola de Firebase](https://console.firebase.google.com/) → ⚙️ **Configuración del proyecto** → **General** → **Tus apps** → app web → **Configuración del SDK**:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=proyecto-paradigmas-7ec7a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyecto-paradigmas-7ec7a
VITE_FIREBASE_STORAGE_BUCKET=proyecto-paradigmas-7ec7a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

- Sin comillas y sin espacios alrededor del `=`.
- El archivo está en `.gitignore` (`*.local`), así que **no se sube** a GitHub.

> **Sin `.env.local` la app también funciona**, en **modo de prueba**: muestra un aviso amarillo y usa datos de ejemplo en memoria, que se pierden al recargar la página.

### 4. Ejecutar la aplicación

```bash
npm run dev
```

Abrir la dirección que aparece en la terminal (normalmente **http://localhost:5173**). La página se actualiza sola al guardar cambios.

> ⚠️ No abrir `index.html` directamente (doble clic o Live Server): se ve una **página en blanco**, porque el navegador no entiende JSX. Siempre se usa `npm run dev`.

Si se cambia `.env.local`, hay que detener el servidor (`Ctrl + C`) y volver a ejecutar `npm run dev`.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas cada vez que se guarda un archivo |
| `npm run lint` | Revisa el código con oxlint |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para revisarla |

### Pruebas

Las pruebas usan **Vitest** y viven en `src/tests/`. Los archivos deben terminar en `.test.js`. No necesitan Firebase: usan un repositorio en memoria o Firestore simulado.

En VS Code se puede instalar la extensión **Vitest** (`vitest.explorer`) para ejecutar cada prueba con un botón ▶.

---

## Estructura del proyecto

Cada carpeta corresponde a una capa y a un paradigma:

```
src/
├─ main.jsx, App.jsx        Entrada y navegación entre los 5 módulos (declarativo)
├─ components/              Pantallas y piezas de la interfaz en React (declarativo)
│   ├─ Dashboard, Calendario, Sidebar          Integrante 4
│   ├─ Tareas, TaskForm, TaskList              Integrante 1
│   ├─ Categorias                              Integrante 2
│   └─ Estadisticas                            Integrante 3
├─ hooks/useTareas.js       Capa de estado: conecta los servicios con las pantallas
├─ services/                Reglas del negocio
│   ├─ TareaService.js         CRUD y validaciones de tareas (imperativo)
│   └─ CategoriaService.js     Administración de categorías (orientado a objetos)
├─ models/                  Clases Tarea y Categoria (orientado a objetos)
├─ funcional/               Funciones puras: filtros, estadísticas, eventos (funcional)
├─ data/                    Acceso a datos
│   ├─ firebase.js             Conexión a Firestore (lee .env.local)
│   ├─ repositorio.js          Lee y escribe en Firestore
│   ├─ repositorioMemoria.js   Alternativa en memoria (modo de prueba y pruebas)
│   └─ tareasEjemplo.js        Datos de ejemplo y utilidades de fecha
└─ tests/                   Pruebas unitarias (Vitest)
```

**Flujo de los datos:** pantalla (componente) → `useTareas` → servicio (valida) → repositorio → Firestore.
Ningún componente habla directamente con Firebase.

### Reparto por integrante

| Integrante | Módulo | Paradigma | Archivos principales |
|---|---|---|---|
| 1 | Gestión de tareas | Imperativo | `TareaService.js`, `TaskForm.jsx`, `TaskList.jsx` |
| 2 | Categorías y base de datos | Orientado a objetos | `Tarea.js`, `Categoria.js`, `firebase.js`, `repositorio.js` |
| 3 | Búsqueda, filtros y estadísticas | Funcional | `filtros.js`, `estadisticas.js`, `Estadisticas.jsx` |
| 4 | Calendario e interfaz React | Declarativo | `App.jsx`, `Calendario.jsx`, `Sidebar.jsx`, `Dashboard.jsx` |

### Convenciones

- Las fechas se guardan como texto **`AAAA-MM-DD`**. Así se pueden comparar como texto (`'2026-11-20' < '2026-11-24'`).
- "Hoy" se calcula una sola vez en `useTareas` y se pasa por parámetro. Las funciones puras y las clases **nunca leen el reloj**, lo que permite probarlas con cualquier fecha.
- Los servicios devuelven `{ ok: true, ... }` o `{ ok: false, error: 'mensaje' }`.

---

## Firestore

Colecciones:

| Colección | Campos |
|---|---|
| `tareas` | `titulo`, `descripcion`, `fechaEntrega` (AAAA-MM-DD), `prioridad` (`baja`/`media`/`alta`), `estado` (`pendiente`/`completada`), `categoriaId` |
| `categorias` | `nombre`, `color` (`#rrggbb`) |

La primera vez que la app abre una base de datos vacía, crea 4 categorías iniciales.

### Reglas de seguridad

El archivo [`firestore.rules`](firestore.rules) valida la forma de cada documento. La app no tiene inicio de sesión (fuera del alcance del proyecto). Si se modifican las reglas, hay que publicarlas de nuevo:

- **Desde la consola:** Firestore Database → pestaña **Reglas** → pegar el contenido → **Publicar**.
- **Con Firebase CLI:** `firebase deploy --only firestore:rules`

---

## Flujo de trabajo con Git

1. Actualizar `main` antes de empezar: `git checkout main` y `git pull`
2. Crear una rama para el trabajo: `git checkout -b feature/nombre`
3. Hacer commits y subir la rama: `git push -u origin feature/nombre`
4. Abrir un Pull Request hacia `main` y pedir revisión a otro integrante.
5. Antes de integrar, comprobar que pasan `npm test` y `npm run lint`.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| **Página en blanco** | Se abrió `index.html` directamente. Usar `npm run dev` y abrir `http://localhost:5173`. |
| **`npm.ps1 no se puede cargar… la ejecución de scripts está deshabilitada`** (PowerShell) | Usar `npm.cmd run dev`, o cambiar la terminal de VS Code a *Command Prompt* / *Git Bash*, o ejecutar una vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| **`Cannot find package 'vite'`** o las pruebas no arrancan | Falta `npm install`. |
| **Aviso amarillo "Modo de prueba"** | No existe `.env.local` o le faltan valores. Crear el archivo y reiniciar `npm run dev`. |
| **Aviso rojo "No se pudieron cargar los datos"** | Revisar que la base de Firestore exista y que las reglas estén publicadas. Ver el error con `F12` → *Console*. |
| **Vitest dice "No test files found"** | Los archivos de prueba deben estar en `src/tests/` y terminar en `.test.js`. |
