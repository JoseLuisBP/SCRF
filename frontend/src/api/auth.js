import axiosInstance from './axios';

const authAPI = {
  // Registro de usuario
  register: async userData => {
    const response = await axiosInstance.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  // Login
  login: async credentials => {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
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
      const response = await axiosInstance.get('/auth/verify');
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response;
  },

  // Actualizar perfil
  updateProfile: async profileData => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Cambiar contraseña
  changePassword: async passwordData => {
    const response = await axiosInstance.put(
      '/auth/change-password',
      passwordData
    );
    return response;
  },

  // Recuperar contraseña
  forgotPassword: async email => {
    const response = await axiosInstance.post('/auth/forgot-password', {
      email,
    });
    return response;
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response;
  },
};

export default authAPI;
