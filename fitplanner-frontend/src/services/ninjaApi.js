import axios from 'axios';

const NINJA_API_BASE_URL = 'https://api.api-ninjas.com/v1';

const ninjaApi = axios.create({
  baseURL: NINJA_API_BASE_URL,
  headers: {
    'X-Api-Key': 'FXf7pnOxXUUq+MV/jF6VxA==ClIQnknQJipw1Y8h',
  },
});

export const getExercisesByMuscle = async (muscle) => {
  try {
    const response = await ninjaApi.get(`/exercises`, {
      params: { muscle }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al buscar ejercicios en API Ninjas');
  }
}; 