import axiosInstance from './axios';

const routinesAPI = {
  // Obtener todas las rutinas del usuario
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/routines', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener rutina por ID
  getById: async id => {
    try {
      const response = await axiosInstance.get(`/routines/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva rutina
  create: async routineData => {
    try {
      const response = await axiosInstance.post('/routines', routineData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar rutina
  update: async (id, routineData) => {
    try {
      const response = await axiosInstance.put(`/routines/${id}`, routineData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar rutina
  delete: async id => {
    try {
      const response = await axiosInstance.delete(`/routines/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Duplicar rutina
  duplicate: async id => {
    try {
      const response = await axiosInstance.post(`/routines/${id}/duplicate`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Agregar ejercicio a rutina
  addExercise: async (routineId, exerciseData) => {
    try {
      const response = await axiosInstance.post(
        `/routines/${routineId}/exercises`,
        exerciseData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar ejercicio en rutina
  updateExercise: async (routineId, exerciseId, exerciseData) => {
    try {
      const response = await axiosInstance.put(
        `/routines/${routineId}/exercises/${exerciseId}`,
        exerciseData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar ejercicio de rutina
  removeExercise: async (routineId, exerciseId) => {
    try {
      const response = await axiosInstance.delete(
        `/routines/${routineId}/exercises/${exerciseId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reordenar ejercicios en rutina
  reorderExercises: async (routineId, exercisesOrder) => {
    try {
      const response = await axiosInstance.put(
        `/routines/${routineId}/reorder`,
        { exercises: exercisesOrder }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Marcar rutina como activa
  setActive: async id => {
    try {
      const response = await axiosInstance.put(`/routines/${id}/activate`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener rutina activa
  getActive: async () => {
    try {
      const response = await axiosInstance.get('/routines/active');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener rutina compartida por token
  getShared: async token => {
    try {
      const response = await axiosInstance.get(`/routines/shared/${token}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default routinesAPI;
