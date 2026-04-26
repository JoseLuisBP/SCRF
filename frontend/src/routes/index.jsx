import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PhysioRoute from './PhysioRoute';

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
// Fisioterapeuta (Rol 2)
const PhysioDashboard = lazy(() => import('../pages/physio/PhysioDashboard'));
const ExerciseCreator = lazy(() => import('../pages/physio/ExerciseCreator'));
const RoutineCreator = lazy(() => import('../pages/physio/RoutineCreator'));
const PendingValidation = lazy(() => import('../pages/physio/PendingValidation'));

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

                    {/* Rutas del Fisioterapeuta (requieren login + id_rol=2 o 3) */}
                    <Route element={<PhysioRoute />}>
                        <Route path="/physio" element={<PhysioDashboard />} />
                        <Route path="/physio/exercises/new" element={<ExerciseCreator />} />
                        <Route path="/physio/routines/new" element={<RoutineCreator />} />
                        <Route path="/physio/routines/pending" element={<PendingValidation />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
