import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'url-real-front' // para producción
  : '/api'; // desarrollo usando proxy

// Configuración base de Axios
const axiosInstance = axios.create({
  // Dirección base de la API, a donde se harán las solicitudes
  baseURL,
  timeout: 10000,
  // Encabezado que indica que el contenido de la solicitud es JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas - agregar token a cada solicitud
axiosInstance.interceptors.request.use(
  config => {
    // Obtiene el token del almacenamiento local del navegador
    const token = localStorage.getItem('token');
    console.log('🔑 Interceptor - Token:', token ? 'Existe' : 'No existe');
    if (token) {
      // Porta el token en el encabezado Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Header Authorization agregado');
    } else {
      console.warn('⚠️ No hay token en localStorage');
    }
    return config;
  },
  error => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          alert('Solicitud incorrecta. Verifica los datos enviados.');
          break;
        case 401:
          localStorage.removeItem('token');
          //window.location.href = '/login';
          break;
        case 403:
          alert('No tienes permiso para realizar esta acción.');
          break;
        case 404:
          alert('Recurso no encontrado.');
          break;
        case 500:
          alert('Error del servidor. Inténtalo de nuevo más tarde.');
          break;
        default:
          alert(
            error.response.data.message ||
              'Ocurrió un error. Inténtalo de nuevo.'
          );
      }
    } else if (error.request) {
      alert('No se recibió respuesta del servidor. Verifica tu conexión.');
    } else {
      alert('Error al configurar la solicitud: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
