import api from './api';

export const getRoutines = async () => {
  const response = await api.get('/routines');
  return response.data;
};

export const getRoutine = async (id) => {
  const response = await api.get(`/routines/${id}`);
  return response.data;
};

export const createRoutine = async (routineData) => {
  const response = await api.post('/routines', routineData);
  return response.data;
};

export const updateRoutine = async (id, routineData) => {
  const response = await api.put(`/routines/${id}`, routineData);
  return response.data;
};

export const deleteRoutine = async (id) => {
  const response = await api.delete(`/routines/${id}`);
  return response.data;
};

export const addExerciseToRoutine = async (routineId, exerciseData) => {
  const response = await api.post(`/routines/${routineId}/exercises`, exerciseData);
  return response.data;
};

export const updateExercise = async (routineId, exerciseId, exerciseData) => {
  const response = await api.put(`/routines/${routineId}/exercises/${exerciseId}`, exerciseData);
  return response.data;
};

export const removeExerciseFromRoutine = async (routineId, exerciseId) => {
  const response = await api.delete(`/routines/${routineId}/exercises/${exerciseId}`);
  return response.data;
}; 