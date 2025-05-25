const Exercise = require('../models/Exercise');
const Routine = require('../models/Routine');

async function getExercisesByRoutine(req, res) {
  try {
    const { routineId } = req.params;
    
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

    const exercises = await Exercise.findAll({
      where: { routineId },
      order: [['createdAt', 'ASC']]
    });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createExercise(req, res) {
  try {
    const { routineId } = req.params;
    const { name, sets, reps, weight } = req.body;

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

async function updateExercise(req, res) {
  try {
    const { id } = req.params;
    const { name, sets, reps, weight } = req.body;

    const exercise = await Exercise.findByPk(id, {
      include: [{
        model: Routine,
        where: { userId: req.user.id }
      }]
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    await exercise.update({
      name: name || exercise.name,
      sets: sets || exercise.sets,
      reps: reps || exercise.reps,
      weight: weight !== undefined ? weight : exercise.weight
    });

    res.json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteExercise(req, res) {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findByPk(id, {
      include: [{
        model: Routine,
        where: { userId: req.user.id }
      }]
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
  getExercisesByRoutine,
  createExercise,
  updateExercise,
  deleteExercise
};