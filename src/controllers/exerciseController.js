const pool = require("../config/config");
const queries = require("../utils/queries");

// GET EXERCISES BY ROUTINE - Obtener ejercicios de una rutina
const getExercisesByRoutine = async (req, res) => {
  let client, result;
  try {
    const { routineId } = req.params;
    
    client = await pool.connect();
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await client.query(queries.checkRoutineOwnership, [routineId, req.user.id]);
    
    if (routine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Obtener ejercicios de la rutina
    const data = await client.query(queries.getExercisesByRoutine, [routineId]);
    result = data.rows;

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// CREATE EXERCISE - Crear nuevo ejercicio para una rutina
const createExercise = async (req, res) => {
  let client, result;
  try {
    const { routineId } = req.params;
    const { name, sets, reps, weight } = req.body;
    
    client = await pool.connect();
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await client.query(queries.checkRoutineOwnership, [routineId, req.user.id]);
    
    if (routine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Crear nuevo ejercicio
    const data = await client.query(queries.createExercise, [name, sets, reps, weight, routineId]);
    result = data.rows[0];

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// UPDATE EXERCISE - Editar ejercicio de una rutina
const updateExercise = async (req, res) => {
  let client, result;
  try {
    const { routineId, exerciseId } = req.params;
    const { name, sets, reps, weight } = req.body;
    
    client = await pool.connect();
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await client.query(queries.checkRoutineOwnership, [routineId, req.user.id]);
    
    if (routine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Busca el ejercicio en la rutina específica
    const existingExercise = await client.query(queries.checkExerciseExists, [exerciseId, routineId]);
    
    if (existingExercise.rows.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const exercise = existingExercise.rows[0];
    
    // Actualizar ejercicio
    const data = await client.query(queries.updateExercise, [
      name || exercise.name,
      sets || exercise.sets,
      reps || exercise.reps,
      weight !== undefined ? weight : exercise.weight,
      exerciseId,
      routineId
    ]);
    
    result = data.rows[0];
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// DELETE EXERCISE - Eliminar ejercicio de una rutina
const deleteExercise = async (req, res) => {
  let client, result;
  try {
    const { routineId, exerciseId } = req.params;
    
    client = await pool.connect();
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await client.query(queries.checkRoutineOwnership, [routineId, req.user.id]);
    
    if (routine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Busca el ejercicio en la rutina específica
    const existingExercise = await client.query(queries.checkExerciseExists, [exerciseId, routineId]);
    
    if (existingExercise.rows.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Eliminar ejercicio
    const data = await client.query(queries.deleteExercise, [exerciseId, routineId]);
    result = data.rowCount;

    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// Función auxiliar para uso interno - obtener ejercicios sin middleware de autenticación
const getExercisesByRoutineId = async (routineId) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getExercisesByRoutine, [routineId]);
    result = data.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// Función auxiliar para crear ejercicio sin middleware de autenticación
const createExerciseInternal = async (name, sets, reps, weight, routineId) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.createExercise, [name, sets, reps, weight, routineId]);
    result = data.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

const exerciseService = {
  getExercisesByRoutine,
  createExercise,
  updateExercise,
  deleteExercise,
  getExercisesByRoutineId,
  createExerciseInternal
};

module.exports = exerciseService; 