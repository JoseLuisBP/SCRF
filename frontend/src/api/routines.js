import axiosInstance from './axios';

const routinesAPI = {
  // Obtener todas las rutinas del usuario
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/v1/routines', { params });
    return response;
  },

  // Obtener rutina por ID
  getById: async id => {
    const response = await axiosInstance.get(`/v1/routines/${id}`);
    return response;
  },

  // Crear nueva rutina
  create: async routineData => {
    const response = await axiosInstance.post('/v1/routines', routineData);
    return response;
  },

  // Actualizar rutina
  update: async (id, routineData) => {
    const response = await axiosInstance.put(`/v1/routines/${id}`, routineData);
    return response;
  },

  // Eliminar rutina
  delete: async id => {
    const response = await axiosInstance.delete(`/v1/routines/${id}`);
    return response;
  },

  // Duplicar rutina
  duplicate: async id => {
    const response = await axiosInstance.post(`/v1/routines/${id}/duplicate`);
    return response;
  },

  // Agregar ejercicio a rutina
  addExercise: async (routineId, exerciseData) => {
    const response = await axiosInstance.post(
      `/v1/routines/${routineId}/exercises`,
      exerciseData
    );
    return response;
  },

  // Actualizar ejercicio en rutina
  updateExercise: async (routineId, exerciseId, exerciseData) => {
    const response = await axiosInstance.put(
      `/v1/routines/${routineId}/exercises/${exerciseId}`,
      exerciseData
    );
    return response;
  },

  // Eliminar ejercicio de rutina
  removeExercise: async (routineId, exerciseId) => {
    const response = await axiosInstance.delete(
      `/v1/routines/${routineId}/exercises/${exerciseId}`
    );
    return response;
  },

  // Reordenar ejercicios en rutina
  reorderExercises: async (routineId, exercisesOrder) => {
    const response = await axiosInstance.put(`/v1/routines/${routineId}/reorder`, {
      exercises: exercisesOrder,
    });
    return response;
  },

  // Marcar rutina como activa
  setActive: async id => {
    const response = await axiosInstance.put(`/v1/routines/${id}/activate`);
    return response;
  },

  // Obtener rutina activa
  getActive: async () => {
    const response = await axiosInstance.get('/v1/routines/active');
    return response;
  },

  // Obtener rutina compartida por token
  getShared: async token => {
    const response = await axiosInstance.get(`/v1/routines/shared/${token}`);
    return response;
  },
};

export default routinesAPI;
