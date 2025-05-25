const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');

// Get all routines for the authenticated user
async function getAllRoutines(req, res) {
  try {
    const routines = await Routine.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Exercise,
        attributes: ['id', 'name', 'sets', 'reps', 'weight']
      }]
    });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a specific routine
async function getRoutine(req, res) {
  try {
    const { id } = req.params;
    const routine = await Routine.findOne({
      where: { id, userId: req.user.id },
      include: [{
        model: Exercise,
        attributes: ['id', 'name', 'sets', 'reps', 'weight']
      }]
    });

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new routine
async function createRoutine(req, res) {
  try {
    const { name, day, objective } = req.body;

    const routine = await Routine.create({
      name,
      day,
      objective,
      userId: req.user.id
    });

    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update a routine
async function updateRoutine(req, res) {
  try {
    const { id } = req.params;
    const { name, day, objective, completed } = req.body;

    const routine = await Routine.findOne({
      where: { id, userId: req.user.id }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    await routine.update({
      name: name || routine.name,
      day: day || routine.day,
      objective: objective || routine.objective,
      completed: completed !== undefined ? completed : routine.completed
    });

    res.json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a routine
async function deleteRoutine(req, res) {
  try {
    const { id } = req.params;

    const routine = await Routine.findOne({
      where: { id, userId: req.user.id }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    await routine.destroy();
    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add exercise to routine
async function addExercise(req, res) {
  try {
    const { id } = req.params;
    const { name, sets, reps, weight } = req.body;

    const routine = await Routine.findOne({
      where: { id, userId: req.user.id }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    const exercise = await Exercise.create({
      name,
      sets,
      reps,
      weight,
      routineId: id
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete exercise from routine
async function deleteExercise(req, res) {
  try {
    const { id, exerciseId } = req.params;

    // Verificar que la rutina existe y pertenece al usuario
    const routine = await Routine.findOne({
      where: { id, userId: req.user.id }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Buscar y eliminar el ejercicio
    const exercise = await Exercise.findOne({
      where: { id: exerciseId, routineId: id }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    await exercise.destroy();

    // Devolver la rutina actualizada con sus ejercicios
    const updatedRoutine = await Routine.findOne({
      where: { id },
      include: [{
        model: Exercise,
        attributes: ['id', 'name', 'sets', 'reps', 'weight']
      }]
    });

    res.json(updatedRoutine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllRoutines,
  getRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addExercise,
  deleteExercise
}; 