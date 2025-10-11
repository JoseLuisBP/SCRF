import axiosInstance from './axios';

const exercisesAPI = {
  // Obtener todos los ejercicios
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/exercises', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener ejercicio por ID
  getById: async id => {
    try {
      const response = await axiosInstance.get(`/exercises/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo ejercicio
  create: async exerciseData => {
    try {
      const response = await axiosInstance.post('/exercises', exerciseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar ejercicio
  update: async (id, exerciseData) => {
    try {
      const response = await axiosInstance.put(
        `/exercises/${id}`,
        exerciseData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar ejercicio
  delete: async id => {
    try {
      const response = await axiosInstance.delete(`/exercises/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar ejercicios
  search: async query => {
    try {
      const response = await axiosInstance.get('/exercises/search', {
        params: { q: query },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Filtrar por categoría
  getByCategory: async category => {
    try {
      const response = await axiosInstance.get('/exercises', {
        params: { category },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Filtrar por grupo muscular
  getByMuscleGroup: async muscleGroup => {
    try {
      const response = await axiosInstance.get('/exercises', {
        params: { muscleGroup },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default exercisesAPI;
