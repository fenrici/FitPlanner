const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');

async function getAllRoutines(req, res) {
  try {
    const routines = await Routine.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Exercise,
        as: 'Exercises'
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getRoutine(req, res) {
  try {
    const routine = await Routine.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [{
        model: Exercise,
        as: 'Exercises'
      }]
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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

async function updateRoutine(req, res) {
  try {
    const { name, day, objective, completed } = req.body;
    
    const routine = await Routine.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
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

async function deleteRoutine(req, res) {
  try {
    const routine = await Routine.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    await routine.destroy();
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addExercise(req, res) {
  try {
    const { name, sets, reps, weight } = req.body;
    const routineId = req.params.id;

    // Verificar que la rutina pertenece al usuario
    const routine = await Routine.findOne({
      where: { 
        id: routineId,
        userId: req.user.id 
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    const exercise = await Exercise.create({
      name,
      sets,
      reps,
      weight,
      routineId
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteExercise(req, res) {
  try {
    const { id: routineId, exerciseId } = req.params;

    // Verificar que la rutina pertenece al usuario
    const routine = await Routine.findOne({
      where: { 
        id: routineId,
        userId: req.user.id 
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    const exercise = await Exercise.findOne({
      where: { 
        id: exerciseId,
        routineId: routineId
      }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    await exercise.destroy();
    res.json({ message: 'Ejercicio eliminado correctamente' });
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