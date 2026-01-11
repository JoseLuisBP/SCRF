import axiosInstance from './axios';

const authAPI = {
  // Registro de usuario
  register: async userData => {
    const response = await axiosInstance.post('/v1/auth/register', userData);
    const { access_token } = response.data;
    if (access_token) {
      localStorage.setItem('token', access_token);
    }
    return response.data;
  },

  // Login
  login: async credentials => {
    const response = await axiosInstance.post('/v1/auth/login', credentials);
    const { access_token } = response.data;
    if (access_token) {
      console.log('✅ Token guardado en localStorage:', access_token.substring(0, 50) + '...');
      localStorage.setItem('token', access_token);
    } else {
      console.error('❌ No se recibió access_token del backend');
    }
    return response.data;
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/v1/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post('/v1/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      // Limpiar localStorage incluso si falla la petición
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/v1/auth/verify');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },
};

export default authAPI;
