import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: localStorage.getItem('token')
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

  const login = (userData) => {
    const token = 'mock-jwt-token'; // Simulado
    localStorage.setItem('token', token);
    setAuthState({
      isLoggedIn: true,
      user: userData,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null
    });
  };

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
    toggleLogin
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
