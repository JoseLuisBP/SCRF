import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: null
  });

  useEffect(() => {
    // Verificar token al cargar
    const token = localStorage.getItem('token');
    if (token) {
      // Validar aquí el token con el backend
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: true,
        token
      }));
    }
  }, []);

  const login = (loginData) => {
    const { access_token, ...userData } = loginData;

    if (!access_token) {
      console.error('No se recibió access_token en loginData');
      return;
    }

    // El token ya fue guardado en authAPI.login()
    // Solo actualizamos el estado
    setAuthState({
      isLoggedIn: true,
      user: userData,
      token: access_token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null
    });
  };
  // Borrar esto cuando Home.jsx este completo
  const toggleLogin = () => {
    if (authState.isLoggedIn) {
      logout();
    } else {
      login({ 
        id: 1, 
        name: 'Usuario de Prueba', 
        email: 'test@example.com' 
      });
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    toggleLogin // Borrar esta linea cuando se borre toggleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
