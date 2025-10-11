import axiosInstance from "./axios";

const authAPI = {
  // Registro de usuario
  register: async userData => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async credentials => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
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
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil
  updateProfile: async profileData => {
    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async passwordData => {
    try {
      const response = await axiosInstance.put(
        '/auth/change-password',
        passwordData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Recuperar contraseña
  forgotPassword: async email => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }a
  },
};

export default authAPI;
