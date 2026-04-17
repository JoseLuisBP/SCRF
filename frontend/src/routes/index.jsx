import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Lazy-loading de todas las páginas
// Cada página se descarga SOLO cuando el usuario navega a esa ruta
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Exercises = lazy(() => import('../pages/Exercises'));
const Routines = lazy(() => import('../pages/Routines'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const Profile = lazy(() => import('../pages/Profile'));

// Spinner centrado mientras se carga el chunk de la página
const PageLoader = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}
    >
        <CircularProgress />
    </Box>
);

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas (requieren login) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/exercises" element={<Exercises />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/routines" element={<Routines />} />

                    {/* Rutas de administración (requieren login + id_rol=3) */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
