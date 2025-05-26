# 📊 Consultas SQL para DBeaver - FitPlanner

Este archivo contiene todas las consultas SQL que puedes ejecutar directamente en DBeaver para administrar tu aplicación FitPlanner.

## 🔐 **GESTIÓN DE USUARIOS**

### Crear nuevo usuario
```sql
INSERT INTO "Users" (id, username, email, password, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'nuevo_usuario',
    'usuario@email.com',
    '$2b$10$hashedpassword...',  -- Usar password hasheada
    NOW(),
    NOW()
);
```

### Ver todos los usuarios
```sql
SELECT 
    id,
    username,
    email,
    "createdAt",
    "updatedAt"
FROM "Users"
ORDER BY "createdAt" DESC;
```

### Buscar usuario por email
```sql
SELECT * FROM "Users" 
WHERE email = 'usuario@email.com';
```

### Eliminar usuario (y todas sus rutinas)
```sql
-- Primero eliminar ejercicios
DELETE FROM "Exercises" 
WHERE "routineId" IN (
    SELECT id FROM "Routines" 
    WHERE "userId" = 'uuid-del-usuario'
);

-- Luego eliminar rutinas
DELETE FROM "Routines" 
WHERE "userId" = 'uuid-del-usuario';

-- Finalmente eliminar usuario
DELETE FROM "Users" 
WHERE id = 'uuid-del-usuario';
```

## 🏋️ **GESTIÓN DE RUTINAS**

### Ver todas las rutinas con ejercicios
```sql
SELECT 
    r.id as routine_id,
    r.name as routine_name,
    r.day,
    r.objective,
    r.completed,
    u.username,
    json_agg(
        CASE WHEN e.id IS NOT NULL THEN
            json_build_object(
                'id', e.id,
                'name', e.name,
                'sets', e.sets,
                'reps', e.reps,
                'weight', e.weight
            )
        END
    ) FILTER (WHERE e.id IS NOT NULL) as exercises
FROM "Routines" r
JOIN "Users" u ON r."userId" = u.id
LEFT JOIN "Exercises" e ON r.id = e."routineId"
GROUP BY r.id, r.name, r.day, r.objective, r.completed, u.username
ORDER BY r."createdAt" DESC;
```

### Rutinas de un usuario específico
```sql
SELECT * FROM "Routines" 
WHERE "userId" = 'uuid-del-usuario'
ORDER BY "createdAt" DESC;
```

### Crear nueva rutina
```sql
INSERT INTO "Routines" (id, name, day, objective, completed, "userId", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Rutina de Pecho',
    'Monday',
    'strength',
    false,
    'uuid-del-usuario',
    NOW(),
    NOW()
);
```

### Actualizar rutina
```sql
UPDATE "Routines" 
SET 
    name = 'Nuevo Nombre',
    day = 'Tuesday',
    objective = 'muscle_gain',
    completed = true,
    "updatedAt" = NOW()
WHERE id = 'uuid-de-la-rutina';
```

### Marcar rutina como completada
```sql
UPDATE "Routines" 
SET completed = true, "updatedAt" = NOW()
WHERE id = 'uuid-de-la-rutina';
```

### Eliminar rutina (y sus ejercicios)
```sql
-- Los ejercicios se eliminan automáticamente por foreign key cascade
DELETE FROM "Routines" 
WHERE id = 'uuid-de-la-rutina';
```

## 🏃 **GESTIÓN DE EJERCICIOS**

### Ver todos los ejercicios de una rutina
```sql
SELECT 
    e.*,
    r.name as routine_name,
    u.username
FROM "Exercises" e
JOIN "Routines" r ON e."routineId" = r.id
JOIN "Users" u ON r."userId" = u.id
WHERE e."routineId" = 'uuid-de-la-rutina'
ORDER BY e."createdAt";
```

### Crear nuevo ejercicio
```sql
INSERT INTO "Exercises" (id, name, sets, reps, weight, "routineId", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Press de Banca',
    4,
    12,
    80.5,
    'uuid-de-la-rutina',
    NOW(),
    NOW()
);
```

### Actualizar ejercicio
```sql
UPDATE "Exercises" 
SET 
    name = 'Press Inclinado',
    sets = 5,
    reps = 10,
    weight = 85.0,
    "updatedAt" = NOW()
WHERE id = 'uuid-del-ejercicio';
```

### Eliminar ejercicio
```sql
DELETE FROM "Exercises" 
WHERE id = 'uuid-del-ejercicio';
```

## 📊 **CONSULTAS DE ANÁLISIS**

### Estadísticas generales
```sql
SELECT 
    'Total Users' as metric, COUNT(*) as value FROM "Users"
UNION ALL
SELECT 
    'Total Routines' as metric, COUNT(*) as value FROM "Routines"
UNION ALL
SELECT 
    'Total Exercises' as metric, COUNT(*) as value FROM "Exercises"
UNION ALL
SELECT 
    'Completed Routines' as metric, COUNT(*) as value FROM "Routines" WHERE completed = true;
```

### Rutinas por día de la semana
```sql
SELECT 
    day,
    COUNT(*) as total_routines,
    COUNT(CASE WHEN completed = true THEN 1 END) as completed_routines,
    ROUND(COUNT(CASE WHEN completed = true THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM "Routines"
GROUP BY day
ORDER BY total_routines DESC;
```

### Ejercicios más populares
```sql
SELECT 
    e.name,
    COUNT(*) as usage_count,
    AVG(e.sets) as avg_sets,
    AVG(e.reps) as avg_reps,
    AVG(e.weight) as avg_weight
FROM "Exercises" e
GROUP BY e.name
HAVING COUNT(*) > 1
ORDER BY usage_count DESC
LIMIT 10;
```

### Objetivos más comunes
```sql
SELECT 
    objective,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM "Routines"
GROUP BY objective
ORDER BY count DESC;
```

### Usuarios más activos
```sql
SELECT 
    u.username,
    u.email,
    COUNT(r.id) as total_routines,
    COUNT(CASE WHEN r.completed = true THEN 1 END) as completed_routines,
    COUNT(e.id) as total_exercises
FROM "Users" u
LEFT JOIN "Routines" r ON u.id = r."userId"
LEFT JOIN "Exercises" e ON r.id = e."routineId"
GROUP BY u.id, u.username, u.email
ORDER BY total_routines DESC;
```

### Progreso del usuario
```sql
-- Reemplaza 'uuid-del-usuario' con el ID real
SELECT 
    r.name as routine_name,
    r.day,
    r.objective,
    r.completed,
    COUNT(e.id) as exercise_count,
    COALESCE(AVG(e.weight), 0) as avg_weight,
    r."createdAt",
    r."updatedAt"
FROM "Routines" r
LEFT JOIN "Exercises" e ON r.id = e."routineId"
WHERE r."userId" = 'uuid-del-usuario'
GROUP BY r.id, r.name, r.day, r.objective, r.completed, r."createdAt", r."updatedAt"
ORDER BY r."createdAt" DESC;
```

## 🔍 **CONSULTAS DE VERIFICACIÓN**

### Verificar integridad de datos
```sql
-- Rutinas sin usuario
SELECT 'Routines without user' as issue, COUNT(*) as count
FROM "Routines" r
LEFT JOIN "Users" u ON r."userId" = u.id
WHERE u.id IS NULL

UNION ALL

-- Ejercicios sin rutina
SELECT 'Exercises without routine' as issue, COUNT(*) as count
FROM "Exercises" e
LEFT JOIN "Routines" r ON e."routineId" = r.id
WHERE r.id IS NULL;
```

### Buscar duplicados
```sql
-- Usuarios con email duplicado
SELECT email, COUNT(*) as count
FROM "Users"
GROUP BY email
HAVING COUNT(*) > 1;

-- Usuarios con username duplicado
SELECT username, COUNT(*) as count
FROM "Users"
GROUP BY username
HAVING COUNT(*) > 1;
```

## 🧹 **CONSULTAS DE LIMPIEZA**

### Eliminar ejercicios sin peso
```sql
DELETE FROM "Exercises" 
WHERE weight IS NULL OR weight = 0;
```

### Eliminar rutinas no completadas más antiguas de 30 días
```sql
DELETE FROM "Routines" 
WHERE completed = false 
  AND "createdAt" < NOW() - INTERVAL '30 days';
```

### Actualizar timestamps
```sql
UPDATE "Users" 
SET "updatedAt" = NOW() 
WHERE "updatedAt" < "createdAt";
```

## 💡 **Tips para DBeaver:**

1. **UUIDs**: Los IDs son UUIDs, cópialos exactamente desde otras consultas
2. **Comillas**: Usa comillas dobles para nombres de columnas con mayúsculas
3. **Timestamps**: Usa `NOW()` para fechas actuales
4. **Transacciones**: Para operaciones múltiples, usa `BEGIN;` ... `COMMIT;`
5. **Backup**: Siempre haz backup antes de operaciones masivas de DELETE/UPDATE

## 🚨 **Consultas de emergencia:**

### Resetear contraseña de usuario
```sql
-- Primero generar hash de la nueva contraseña usando bcrypt
UPDATE "Users" 
SET password = '$2b$10$nueva_password_hasheada', "updatedAt" = NOW()
WHERE email = 'usuario@email.com';
```

### Obtener JWT token manualmente (para testing)
```sql
-- Solo para obtener el ID del usuario para generar token manualmente
SELECT id, username, email FROM "Users" 
WHERE email = 'usuario@email.com';
``` 