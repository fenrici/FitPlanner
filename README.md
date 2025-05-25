# 🏋️‍♂️ FitPlanner

**FitPlanner** es una aplicación FullStack para gestionar rutinas de ejercicios personalizadas.

## 🎯 **Características Principales**

- ✅ **Autenticación JWT** - Sistema seguro de login/registro
- ✅ **Gestión de Rutinas** - Crear, editar y eliminar rutinas personalizadas
- ✅ **Catálogo de Ejercicios** - Integración con Ninja API
- ✅ **Seguimiento de Progreso** - Control de series, repeticiones y peso
- ✅ **Diseño Responsivo** - Mobile-first con Tailwind CSS
- ✅ **Validaciones** - Regex y validaciones en backend

## 🏗️ **Arquitectura**

```
🎨 FRONTEND (React + Vite + SASS)
├── Puerto: 5173 (desarrollo)
├── Framework: React 19.1.0
├── Styling: SASS
└── HTTP Client: Axios

🔧 BACKEND (Node.js + Express)
├── Puerto: 3000
├── Framework: Express
├── Base de Datos: PostgreSQL (Render)
├── ORM: Sequelize
└── Autenticación: JWT

🌐 API EXTERNA
└── Ninja API (catálogo de ejercicios)
```

## 📊 **Base de Datos**

### Relaciones:
- **User** 1:N **Routine** 1:N **Exercise**

### Modelos:
- **User**: id, username, email, password
- **Routine**: id, name, day, objective, completed, userId
- **Exercise**: id, name, sets, reps, weight, routineId

## 🚀 **Instalación**

### Backend:
```bash
npm install
npm run dev
```

### Frontend:
```bash
cd fitplanner-frontend
npm install
npm run dev
```

## 🔧 **Variables de Entorno**

```env
JWT_SECRET=tu_jwt_secret
PORT=3000
```

## 📱 **Funcionalidades**

### 🔐 Autenticación
- Registro con validaciones
- Login con JWT
- Middleware de protección

### 🏃‍♂️ Gestión de Rutinas
- CRUD completo de rutinas
- Filtrado por día de la semana
- Objetivos personalizados

### 💪 Gestión de Ejercicios
- Añadir ejercicios a rutinas
- Control de series, repeticiones y peso
- Integración con catálogo externo

## 🛠️ **Tecnologías Utilizadas**

### Frontend:
- React 19.1.0
- Vite
- Tailwind CSS
- SASS
- Axios
- React Router DOM

### Backend:
- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- bcrypt
- CORS

## 📝 **API Endpoints**

### Autenticación:
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Rutinas:
- `GET /api/routines` - Obtener rutinas
- `POST /api/routines` - Crear rutina
- `PUT /api/routines/:id` - Actualizar rutina
- `DELETE /api/routines/:id` - Eliminar rutina

### Ejercicios:
- `GET /api/exercises/routines/:id/exercises` - Ejercicios de rutina
- `POST /api/exercises/routines/:id/exercises` - Crear ejercicio
- `PUT /api/exercises/exercises/:id` - Actualizar ejercicio
- `DELETE /api/exercises/exercises/:id` - Eliminar ejercicio

## 👨‍💻 **Desarrollador**

Proyecto desarrollado como parte del curso FullStack Developer en TheBridge.

---

**FitPlanner** - Tu compañero perfecto para gestionar tus rutinas de ejercicio 💪 