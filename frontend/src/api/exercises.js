import axiosInstance from './axios';

const exercisesAPI = {
  // Obtener todos los ejercicios
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/exercises', { params });
    return response;
  },

  // Obtener ejercicio por ID
  getById: async id => {
    const response = await axiosInstance.get(`/exercises/${id}`);
    return response;
  },

  // Crear nuevo ejercicio
  create: async exerciseData => {
    const response = await axiosInstance.post('/exercises', exerciseData);
    return response;
  },

  // Actualizar ejercicio
  update: async (id, exerciseData) => {
    const response = await axiosInstance.put(`/exercises/${id}`, exerciseData);
    return response;
  },

  // Eliminar ejercicio
  delete: async id => {
    const response = await axiosInstance.delete(`/exercises/${id}`);
    return response;
  },

  // Buscar ejercicios
  search: async query => {
    const response = await axiosInstance.get('/exercises/search', {
      params: { q: query },
    });
    return response;
  },

  // Filtrar por categoría
  getByCategory: async category => {
    const response = await axiosInstance.get('/exercises', {
      params: { category },
    });
    return response;
  },

  // Filtrar por grupo muscular
  getByMuscleGroup: async muscleGroup => {
    const response = await axiosInstance.get('/exercises', {
      params: { muscleGroup },
    });
    return response;
  },
};

export default exercisesAPI;
