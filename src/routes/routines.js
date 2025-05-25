const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const auth = require('../middlewares/auth');

// Todas las rutas están protegidas con middleware de autenticación
router.use(auth);

// Obtener todas las rutinas
router.get('/', routineController.getAllRoutines);

// Obtener una rutina específica
router.get('/:id', routineController.getRoutine);

// Crear nueva rutina
router.post('/', routineController.createRoutine);

// Actualizar rutina
router.put('/:id', routineController.updateRoutine);

// Eliminar rutina
router.delete('/:id', routineController.deleteRoutine);

// Agregar ejercicio a rutina
router.post('/:id/exercises', routineController.addExercise);

// Eliminar ejercicio de rutina
router.delete('/:id/exercises/:exerciseId', routineController.deleteExercise);

module.exports = router;