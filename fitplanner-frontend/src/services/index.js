// Auth exports
export * from './auth';

// Routines exports
export * from './routines';

// Exercise API exports
export { getExercisesByMuscle } from './ninjaApi';

// API instance
export { default as api } from './api';

// Aliases for backward compatibility
import { 
  addExerciseToRoutine, 
  removeExerciseFromRoutine,
  updateExercise 
} from './routines';

export { addExerciseToRoutine as addExercise };
export { removeExerciseFromRoutine as deleteExercise };
export { updateExercise };