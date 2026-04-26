import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guarda de ruta para vistas del Fisioterapeuta.
 * Permite acceso a id_rol=2 (Fisio) y id_rol=3 (Admin).
 * Redirige al /dashboard si el usuario no tiene scope clínico.
 *
 * Uso: Envolver las rutas de fisio en AppRoutes dentro de <PhysioRoute />,
 * que a su vez debe estar ya dentro de <ProtectedRoute /> para garantizar
 * que el usuario está logueado antes de verificar el rol.
 */
export default function PhysioRoute() {
    const { isPhysio, isLoggedIn } = useAuth();

    // Si no está logueado (ProtectedRoute debería haberlo capturado antes)
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Si está logueado pero no tiene scope clínico, redirigir al dashboard
    if (!isPhysio) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
