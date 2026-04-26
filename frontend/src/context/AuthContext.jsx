import { createContext, useContext, useState, useEffect } from 'react';
import authAPI from '../api/auth';

const AuthContext = createContext();

// IDs de roles según la tabla roles de PostgreSQL
const ADMIN_ROL_ID = 3;
const PHYSIO_ROL_ID = 2;

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
    // id_rol del usuario autenticado (null = no autenticado o rol desconocido)
    id_rol: null,
  });

  // Al arrancar, restauramos la sesión si existe un token guardado.
  // Se llama a /auth/verify para obtener el perfil completo (incluyendo id_rol)
  // y garantizar que el token sigue siendo válido.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Intentar restaurar id_rol desde localStorage (evita flash de UI sin rol)
    const storedRol = localStorage.getItem('id_rol');
    if (storedRol) {
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: true,
        token,
        id_rol: parseInt(storedRol, 10),
      }));
    } else {
      setAuthState(prev => ({ ...prev, isLoggedIn: true, token }));
    }

    // Verificar token con el backend y refrescar perfil + id_rol real
    authAPI.verifyToken()
      .then(userData => {
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: true,
          user: userData,
          id_rol: userData?.id_rol ?? null,
        }));
        if (userData?.id_rol != null) {
          localStorage.setItem('id_rol', String(userData.id_rol));
        }
      })
      .catch(() => {
        // Token inválido o expirado — limpiar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('id_rol');
        localStorage.removeItem('user');
        setAuthState({ isLoggedIn: false, user: null, token: null, id_rol: null });
      });
  }, []);

  const login = (loginData) => {
    const { access_token, id_rol, ...userData } = loginData;

    if (!access_token) {
      console.error('No se recibió access_token en loginData');
      return;
    }

    // id_rol ahora viene directamente en la respuesta del servidor (Token schema).
    // Se persiste en localStorage para restaurarlo en recargas sin re-verificar.
    if (id_rol != null) {
      localStorage.setItem('id_rol', String(id_rol));
    }

    setAuthState({
      isLoggedIn: true,
      user: userData,
      token: access_token,
      id_rol: id_rol ?? null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id_rol');
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
      id_rol: null,
    });
  };

  // Helpers derivados de id_rol
  const isAdmin = authState.id_rol === ADMIN_ROL_ID;
  // Fisio (Rol 2) o Admin (Rol 3) tienen scope clínico — espeja check_physio_role del backend
  const isPhysio = authState.id_rol === PHYSIO_ROL_ID || authState.id_rol === ADMIN_ROL_ID;

  const value = {
    ...authState,
    isAdmin,
    isPhysio,
    login,
    logout,
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
