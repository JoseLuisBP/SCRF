import axiosInstance from './axios';

const progressAPI = {
  // Registrar entrenamiento completado
  logWorkout: async workoutData => {
    const response = await axiosInstance.post(
      '/v1/progress/workouts',
      workoutData
    );
    return response;
  },

  // Obtener historial de entrenamientos
  getWorkoutHistory: async (params = {}) => {
    const response = await axiosInstance.get('/v1/progress/workouts', {
      params,
    });
    return response;
  },

  // Obtener entrenamiento específico
  getWorkoutById: async id => {
    const response = await axiosInstance.get(`/v1/progress/workouts/${id}`);
    return response;
  },

  // Actualizar entrenamiento
  updateWorkout: async (id, workoutData) => {
    const response = await axiosInstance.put(
      `/v1/progress/workouts/${id}`,
      workoutData
    );
    return response;
  },

  // Eliminar entrenamiento
  deleteWorkout: async id => {
    const response = await axiosInstance.delete(`/v1/progress/workouts/${id}`);
    return response;
  },

  // Obtener estadísticas generales
  getStats: async (dateRange = {}) => {
    const response = await axiosInstance.get('/v1/progress/stats', {
      params: dateRange,
    });
    return response;
  },

  // Obtener progreso semanal
  getWeeklyProgress: async () => {
    const response = await axiosInstance.get('/v1/progress/weekly');
    return response;
  },

  // Obtener progreso mensual
  getMonthlyProgress: async () => {
    const response = await axiosInstance.get('/v1/progress/monthly');
    return response;
  },
};

export default progressAPI;
