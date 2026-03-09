import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guarda de ruta para vistas de administración.
 * Redirige al /dashboard si el usuario autenticado no tiene id_rol=3.
 *
 * Uso: Envolver las rutas de admin en AppRoutes dentro de <AdminRoute />,
 * que a su vez debe estar ya dentro de <ProtectedRoute /> para garantizar
 * que el usuario está logueado antes de verificar el rol.
 */
export default function AdminRoute() {
    const { isAdmin, isLoggedIn } = useAuth();

    // Si no está logueado (caso extremo, ProtectedRoute debería haberlo capturado)
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Si está logueado pero no tiene rol de administrador, redirigir al dashboard
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
