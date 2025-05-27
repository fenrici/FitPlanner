# 🏋️‍♂️ FitPlanner

**FitPlanner** es una aplicación FullStack para gestionar rutinas de ejercicios personalizadas. Permite crear rutinas personalizadas, gestionar ejercicios con métricas detalladas e integrar un catálogo externo de ejercicios.

## 🎯 **Características Principales**

- ✅ **Autenticación JWT** - Sistema seguro de login/registro con tokens
- ✅ **Gestión de Rutinas** - CRUD completo con objetivos personalizados
- ✅ **Catálogo de Ejercicios** - Integración con Ninja API + ejercicios manuales
- ✅ **Seguimiento de Progreso** - Control de series, repeticiones y peso
- ✅ **Diseño Moderno** - responsive con SASS
- ✅ **Arquitectura Optimizada** - Hooks centralizados y componentes reutilizables

## 🏗️ **Arquitectura**

```
🎨 FRONTEND (React + Vite + SASS)
├── Puerto: 5173 (desarrollo)
├── Framework: React 18.2.0
├── Build Tool: Vite 6.3.5
├── Styling: SASS 1.89.0 
├── HTTP Client: Axios 1.9.0
├── Routing: React Router DOM 6.22.3
└── Hooks: useMenu, useError, useForm, useFetch

🔧 BACKEND (Node.js + Express + PostgreSQL)
├── Puerto: 3000
├── Framework: Express 4.18.2
├── Base de Datos: PostgreSQL (Render Cloud)
├── Database: SQL directo con Pool connections
├── Autenticación: JWT + bcrypt
├── Middleware: CORS + Auth protection
└── API Externa: Ninja API integration

🌐 APIs
├── Ninja API (catálogo de ejercicios)
└── REST API interna (autenticación + CRUD)
```

## 📊 **Base de Datos (PostgreSQL)**

### Relaciones:
- **User** 1:N **Routine** 1:N **Exercise**

### Esquema:
```sql
Users: id, username, email, password, createdAt, updatedAt
Routines: id, name, day, objective, completed, userId, createdAt, updatedAt  
Exercises: id, name, sets, reps, weight, routineId, createdAt, updatedAt
```

### Características:
- ✅ Pool de conexiones para performance
- ✅ Queries SQL optimizadas con JOINs
- ✅ Agregaciones JSON para datos anidados
- ✅ Hosted en Render Cloud (production-ready)

## 🚀 **Instalación y Desarrollo**

### Requisitos:
- Node.js 16+
- PostgreSQL (o usar la instancia de Render)

### Backend:
```bash
# Instalar dependencias
npm install

# Desarrollo con auto-reload
npm run dev

# Producción
npm start
```

### Frontend:
```bash
cd fitplanner-frontend

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 **Variables de Entorno**

### Backend (.env):
```env
JWT_SECRET=fitplanner_secret_key_2024
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://...
```

## 📱 **Funcionalidades Implementadas**

### 🔐 Sistema de Autenticación
- Registro con validaciones de email y contraseña
- Login con JWT tokens (localStorage)
- Middleware de protección en rutas privadas
- Auto-redirect en sesiones expiradas

### 🏃‍♂️ Gestión de Rutinas
- CRUD completo (crear, leer, actualizar, eliminar)
- Clasificación por día de la semana
- Objetivos personalizados (fuerza, resistencia, etc.)
- Estados de completado

### 💪 Gestión de Ejercicios
- Añadir ejercicios desde catálogo externo (Ninja API)
- Crear ejercicios manuales personalizados
- Edición inline de series, repeticiones y peso
- Eliminación individual de ejercicios

### 🎨 Interfaz de Usuario
- Diseño glassmorphism moderno
- Responsive design mobile-first
- Loading states optimizados
- Error handling centralizado
- Navegación por menú hamburguesa

## 🛠️ **Stack Tecnológico**

### Frontend:
- **React** 18.2.0 - Library principal
- **Vite** 6.3.5 - Build tool y dev server
- **SASS** 1.89.0 - Preprocesador CSS modernizado
- **Axios** 1.9.0 - Cliente HTTP
- **React Router DOM** 6.22.3 - Routing SPA

### Backend:
- **Node.js** - Runtime JavaScript
- **Express** 4.18.2 - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** 9.0.2 - Autenticación
- **bcrypt** 5.1.1 - Hash de contraseñas
- **CORS** 2.8.5 - Cross-origin requests

### DevOps & Tools:
- **Nodemon** - Auto-reload en desarrollo
- **ESLint** - Linting de código
- **Render** - Hosting PostgreSQL

## 📝 **API Endpoints**

### Autenticación:
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Rutinas (Protegidas):
- `GET /api/routines` - Obtener rutinas del usuario
- `GET /api/routines/:id` - Obtener rutina específica
- `POST /api/routines` - Crear nueva rutina
- `PUT /api/routines/:id` - Actualizar rutina
- `DELETE /api/routines/:id` - Eliminar rutina

### Ejercicios (Protegidas):
- `GET /api/exercises/muscle/:muscle` - Ejercicios por músculo (Ninja API)
- `POST /api/routines/:id/exercises` - Añadir ejercicio a rutina
- `PUT /api/routines/:routineId/exercises/:id` - Actualizar ejercicio
- `DELETE /api/routines/:routineId/exercises/:id` - Eliminar ejercicio

## 🔧 **Arquitectura del Código**

### Frontend - Hooks Centralizados:
```
hooks/
├── useMenu.js - Lógica de menú hamburguesa
├── useError.jsx - Manejo de errores + ErrorDisplay
├── useForm.js - Gestión de formularios
└── useFetch.js - Peticiones HTTP con loading
```

### Frontend - Componentes Optimizados:
```
components/
├── layout/AppLayout.jsx - Layout unificado (navbar + sidebar)
├── features/ - Componentes de funcionalidad
└── common/ - Componentes reutilizables
```

### Backend - Estructura MVC:
```
src/
├── controllers/ - Lógica de negocio
├── routes/ - Definición de endpoints
├── middlewares/ - Auth y validaciones
├── utils/ - Queries SQL optimizadas
└── config/ - Configuración de DB
```

## 🚀 **Optimizaciones Implementadas**

### Performance:
- Pool de conexiones PostgreSQL
- Hooks memoizados en React
- SASS modernizado (0 deprecation warnings)
- Loading states optimizados

### Código:
- 380 líneas de código duplicado eliminadas
- Componentes reutilizables centralizados
- Error handling unificado
- Arquitectura DRY (Don't Repeat Yourself)

## 🎯 **Estado del Proyecto**

**✅ Production Ready**
- Backend estable con PostgreSQL en cloud
- Frontend optimizado y sin warnings
- Autenticación JWT segura
- UI/UX moderna y responsive
- Código mantenible y escalable

## 👨‍💻 **Desarrollador**

Proyecto desarrollado por **Franco Enrici** como parte del curso FullStack Developer en **TheBridge**.

---

**FitPlanner** - Tu compañero perfecto para gestionar tus rutinas de ejercicio 💪 