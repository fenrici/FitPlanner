const pool = require("../config/config");
const queries = require("../utils/queries");

// GET ALL ROUTINES - Obtener todas las rutinas del usuario
const getAllRoutines = async (req, res) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getAllRoutines, [req.user.id]);
    result = data.rows;
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// GET ROUTINE BY ID - Obtener rutina específica
const getRoutine = async (req, res) => {
  let client, result;
  try {
    const { id } = req.params;
    
    client = await pool.connect();
    const data = await client.query(queries.getRoutineById, [id, req.user.id]);
    
    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    result = data.rows[0];
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// CREATE ROUTINE - Crear nueva rutina
const createRoutine = async (req, res) => {
  let client, result;
  try {
    const { name, day, objective } = req.body;

    client = await pool.connect();
    const data = await client.query(queries.createRoutine, [name, day, objective, req.user.id]);
    result = data.rows[0];
    
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// UPDATE ROUTINE - Actualizar rutina
const updateRoutine = async (req, res) => {
  let client, result;
  try {
    const { id } = req.params;
    const { name, day, objective, completed } = req.body;

    client = await pool.connect();

    // Verificar que la rutina existe y pertenece al usuario
    const existingRoutine = await client.query(queries.checkRoutineOwnership, [id, req.user.id]);
    
    if (existingRoutine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    const routine = existingRoutine.rows[0];

    // Actualizar rutina
    const data = await client.query(queries.updateRoutine, [
      name || routine.name,
      day || routine.day,
      objective || routine.objective,
      completed !== undefined ? completed : routine.completed,
      id,
      req.user.id
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

// DELETE ROUTINE - Eliminar rutina
const deleteRoutine = async (req, res) => {
  let client, result;
  try {
    const { id } = req.params;

    client = await pool.connect();

    // Verificar que la rutina existe y pertenece al usuario
    const existingRoutine = await client.query(queries.checkRoutineOwnership, [id, req.user.id]);
    
    if (existingRoutine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Eliminar rutina (los ejercicios se eliminan por cascade)
    const data = await client.query(queries.deleteRoutine, [id, req.user.id]);
    result = data.rowCount;

    res.json({ message: 'Routine deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// ADD EXERCISE - Agregar ejercicio a rutina
const addExercise = async (req, res) => {
  let client, result;
  try {
    const { id } = req.params;
    const { name, sets, reps, weight } = req.body;

    client = await pool.connect();

    // Verificar que la rutina existe y pertenece al usuario
    const existingRoutine = await client.query(queries.checkRoutineOwnership, [id, req.user.id]);
    
    if (existingRoutine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Crear ejercicio
    const data = await client.query(queries.createExercise, [name, sets, reps, weight, id]);
    result = data.rows[0];

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// DELETE EXERCISE - Eliminar ejercicio de rutina
const deleteExercise = async (req, res) => {
  let client, result;
  try {
    const { id, exerciseId } = req.params;

    client = await pool.connect();

    // Verificar que la rutina existe y pertenece al usuario
    const existingRoutine = await client.query(queries.checkRoutineOwnership, [id, req.user.id]);
    
    if (existingRoutine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Verificar que el ejercicio existe en la rutina
    const existingExercise = await client.query(queries.checkExerciseExists, [exerciseId, id]);
    
    if (existingExercise.rows.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Eliminar ejercicio
    await client.query(queries.deleteExercise, [exerciseId, id]);

    // Devolver la rutina actualizada con sus ejercicios
    const updatedRoutine = await client.query(queries.getRoutineById, [id, req.user.id]);
    result = updatedRoutine.rows[0];

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// MARK ROUTINE COMPLETED - Marcar rutina como completada
const markCompleted = async (req, res) => {
  let client, result;
  try {
    const { id } = req.params;

    client = await pool.connect();

    // Verificar que la rutina existe y pertenece al usuario
    const existingRoutine = await client.query(queries.checkRoutineOwnership, [id, req.user.id]);
    
    if (existingRoutine.rows.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Marcar como completada
    const data = await client.query(queries.markRoutineCompleted, [id, req.user.id]);
    result = data.rows[0];

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// Función auxiliar para uso interno - obtener rutinas sin middleware de autenticación
const getRoutinesByUserId = async (userId) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getAllRoutines, [userId]);
    result = data.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

const routineService = {
  getAllRoutines,
  getRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addExercise,
  deleteExercise,
  markCompleted,
  getRoutinesByUserId
};

module.exports = routineService; 