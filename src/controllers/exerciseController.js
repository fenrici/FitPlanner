const Exercise = require('../models/Exercise');
const Routine = require('../models/Routine');

// Obtener ejercicios de una rutina
async function getExercisesByRoutine(req, res) {
  try {
    const { routineId } = req.params;
    // Verifica que la rutina pertenezca al usuario
    const routine = await Routine.findOne({ where: { id: routineId, userId: req.user.id } });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

    const exercises = await Exercise.findAll({ where: { routineId } });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Crear nuevo ejercicio para una rutina
async function createExercise(req, res) {
  try {
    const { routineId } = req.params;
    const { name, sets, reps, weight } = req.body;
    // Verifica que la rutina pertenezca al usuario
    const routine = await Routine.findOne({ where: { id: routineId, userId: req.user.id } });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

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

// Editar ejercicio de una rutina
async function updateExercise(req, res) {
  try {
    const { routineId, exerciseId } = req.params;
    const { name, sets, reps, weight } = req.body;
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await Routine.findOne({ where: { id: routineId, userId: req.user.id } });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

    // Busca el ejercicio en la rutina específica
    const exercise = await Exercise.findOne({ 
      where: { 
        id: exerciseId, 
        routineId: routineId 
      } 
    });
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
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

// Eliminar ejercicio de una rutina
async function deleteExercise(req, res) {
  try {
    const { routineId, exerciseId } = req.params;
    
    // Verifica que la rutina pertenezca al usuario
    const routine = await Routine.findOne({ where: { id: routineId, userId: req.user.id } });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

    // Busca el ejercicio en la rutina específica
    const exercise = await Exercise.findOne({ 
      where: { 
        id: exerciseId, 
        routineId: routineId 
      } 
    });
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    await exercise.destroy();
    res.json({ message: 'Exercise deleted successfully' });
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