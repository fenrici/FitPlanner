const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middlewares/auth');

router.use(auth);

// Obtener ejercicios de una rutina
router.get('/routines/:routineId/exercises', exerciseController.getExercisesByRoutine);

// Crear nuevo ejercicio para una rutina
router.post('/routines/:routineId/exercises', exerciseController.createExercise);

// Editar ejercicio de una rutina
router.put('/routines/:routineId/exercises/:exerciseId', exerciseController.updateExercise);

// Eliminar ejercicio de una rutina
router.delete('/routines/:routineId/exercises/:exerciseId', exerciseController.deleteExercise);

module.exports = router;