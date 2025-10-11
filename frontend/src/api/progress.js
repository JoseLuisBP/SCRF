import axiosInstance from './axios';

const progressAPI = {
  // Registrar entrenamiento completado
  logWorkout: async workoutData => {
    try {
      const response = await axiosInstance.post('/progress/workouts', workoutData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener historial de entrenamientos
  getWorkoutHistory: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/progress/workouts', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener entrenamiento específico
  getWorkoutById: async id => {
    try {
      const response = await axiosInstance.get(`/progress/workouts/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar entrenamiento
  updateWorkout: async (id, workoutData) => {
    try {
      const response = await axiosInstance.put(
        `/progress/workouts/${id}`,
        workoutData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar entrenamiento
  deleteWorkout: async id => {
    try {
      const response = await axiosInstance.delete(`/progress/workouts/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas generales
  getStats: async (dateRange = {}) => {
    try {
      const response = await axiosInstance.get('/progress/stats', {
        params: dateRange,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener progreso semanal
  getWeeklyProgress: async () => {
    try {
      const response = await axiosInstance.get('/progress/weekly');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener progreso mensual
  getMonthlyProgress: async () => {
    try {
      const response = await axiosInstance.get('/progress/monthly');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default progressAPI;
