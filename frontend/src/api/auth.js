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

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await axiosInstance.get('/v1/auth/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async profileData => {
    const response = await axiosInstance.put('/v1/auth/profile', profileData);
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async passwordData => {
    const response = await axiosInstance.put(
      '/v1/auth/change-password',
      passwordData
    );
    return response.data;
  },

  // Recuperar contraseña
  forgotPassword: async email => {
    const response = await axiosInstance.post('/v1/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/v1/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  },
};

export default authAPI;
