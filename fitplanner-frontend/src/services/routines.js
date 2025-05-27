import { protectedRequest } from './api';

export const getRoutines = async () => {
  return await protectedRequest('GET', '/routines');
};

export const getRoutine = async (id) => {
  return await protectedRequest('GET', `/routines/${id}`);
};

export const createRoutine = async (routineData) => {
  return await protectedRequest('POST', '/routines', routineData);
};

export const updateRoutine = async (id, routineData) => {
  return await protectedRequest('PUT', `/routines/${id}`, routineData);
};

export const deleteRoutine = async (id) => {
  return await protectedRequest('DELETE', `/routines/${id}`);
};

export const addExerciseToRoutine = async (routineId, exerciseData) => {
  return await protectedRequest('POST', `/routines/${routineId}/exercises`, exerciseData);
};

export const updateExercise = async (routineId, exerciseId, exerciseData) => {
  return await protectedRequest('PUT', `/routines/${routineId}/exercises/${exerciseId}`, exerciseData);
};

export const removeExerciseFromRoutine = async (routineId, exerciseId) => {
  return await protectedRequest('DELETE', `/routines/${routineId}/exercises/${exerciseId}`);
}; 