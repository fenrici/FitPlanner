// ===========================
// QUERIES para USUARIOS
// ===========================

const getUsers = `
  SELECT id, username, email, "createdAt", "updatedAt" 
  FROM "Users" 
  ORDER BY "createdAt" DESC
`;

const getUserById = `
  SELECT * FROM "Users" 
  WHERE id = $1
`;

const getUserByEmail = `
  SELECT * FROM "Users" 
  WHERE email = $1
`;

const createUser = `
  INSERT INTO "Users" (id, username, email, password, "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
  RETURNING id, username, email, "createdAt", "updatedAt"
`;

const updateUser = `
  UPDATE "Users" 
  SET username = $1, email = $2, "updatedAt" = NOW()
  WHERE email = $3
  RETURNING id, username, email, "createdAt", "updatedAt"
`;

const deleteUser = `
  DELETE FROM "Users" 
  WHERE email = $1
`;

const checkUserExists = `
  SELECT * FROM "Users" 
  WHERE email = $1 OR username = $2
`;

// ===========================
// QUERIES para RUTINAS
// ===========================

const getAllRoutines = `
  SELECT 
    r.id,
    r.name,
    r.day,
    r.objective,
    r.completed,
    r."createdAt",
    r."updatedAt",
    COALESCE(
      json_agg(
        json_build_object(
          'id', e.id,
          'name', e.name,
          'sets', e.sets,
          'reps', e.reps,
          'weight', e.weight
        )
      ) FILTER (WHERE e.id IS NOT NULL),
      '[]'::json
    ) as exercises
  FROM "Routines" r
  LEFT JOIN "Exercises" e ON r.id = e."routineId"
  WHERE r."userId" = $1
  GROUP BY r.id, r.name, r.day, r.objective, r.completed, r."createdAt", r."updatedAt"
  ORDER BY r."createdAt" DESC
`;

const getRoutineById = `
  SELECT 
    r.id,
    r.name,
    r.day,
    r.objective,
    r.completed,
    r."createdAt",
    r."updatedAt",
    COALESCE(
      json_agg(
        json_build_object(
          'id', e.id,
          'name', e.name,
          'sets', e.sets,
          'reps', e.reps,
          'weight', e.weight
        )
      ) FILTER (WHERE e.id IS NOT NULL),
      '[]'::json
    ) as exercises
  FROM "Routines" r
  LEFT JOIN "Exercises" e ON r.id = e."routineId"
  WHERE r.id = $1 AND r."userId" = $2
  GROUP BY r.id, r.name, r.day, r.objective, r.completed, r."createdAt", r."updatedAt"
`;

const createRoutine = `
  INSERT INTO "Routines" (id, name, day, objective, completed, "userId", "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), $1, $2, $3, false, $4, NOW(), NOW())
  RETURNING *
`;

const updateRoutine = `
  UPDATE "Routines" 
  SET 
    name = $1,
    day = $2,
    objective = $3,
    completed = $4,
    "updatedAt" = NOW()
  WHERE id = $5 AND "userId" = $6
  RETURNING *
`;

const deleteRoutine = `
  DELETE FROM "Routines" 
  WHERE id = $1 AND "userId" = $2
`;

const checkRoutineOwnership = `
  SELECT * FROM "Routines" 
  WHERE id = $1 AND "userId" = $2
`;

const markRoutineCompleted = `
  UPDATE "Routines" 
  SET completed = true, "updatedAt" = NOW()
  WHERE id = $1 AND "userId" = $2
  RETURNING *
`;

// ===========================
// QUERIES para EJERCICIOS
// ===========================

const getExercisesByRoutine = `
  SELECT * FROM "Exercises" 
  WHERE "routineId" = $1
  ORDER BY "createdAt"
`;

const createExercise = `
  INSERT INTO "Exercises" (id, name, sets, reps, weight, "routineId", "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
  RETURNING *
`;

const updateExercise = `
  UPDATE "Exercises" 
  SET 
    name = $1,
    sets = $2,
    reps = $3,
    weight = $4,
    "updatedAt" = NOW()
  WHERE id = $5 AND "routineId" = $6
  RETURNING *
`;

const deleteExercise = `
  DELETE FROM "Exercises" 
  WHERE id = $1 AND "routineId" = $2
`;

const checkExerciseExists = `
  SELECT * FROM "Exercises" 
  WHERE id = $1 AND "routineId" = $2
`;

// ===========================
// QUERIES ESTADÍSTICAS
// ===========================

const getGeneralStats = `
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
    'Completed Routines' as metric, COUNT(*) as value FROM "Routines" WHERE completed = true
`;

const getRoutinesByDay = `
  SELECT 
    day,
    COUNT(*) as total_routines,
    COUNT(CASE WHEN completed = true THEN 1 END) as completed_routines,
    ROUND(COUNT(CASE WHEN completed = true THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
  FROM "Routines"
  GROUP BY day
  ORDER BY total_routines DESC
`;

const getMostPopularExercises = `
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
  LIMIT 10
`;

const getUserProgress = `
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
  WHERE r."userId" = $1
  GROUP BY r.id, r.name, r.day, r.objective, r.completed, r."createdAt", r."updatedAt"
  ORDER BY r."createdAt" DESC
`;

module.exports = {
  // Usuarios
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  checkUserExists,
  
  // Rutinas
  getAllRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  checkRoutineOwnership,
  markRoutineCompleted,
  
  // Ejercicios
  getExercisesByRoutine,
  createExercise,
  updateExercise,
  deleteExercise,
  checkExerciseExists,
  
  // Estadísticas
  getGeneralStats,
  getRoutinesByDay,
  getMostPopularExercises,
  getUserProgress
}; 