import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

//Páginas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
//import Routines from '../pages/Routines';
import Exercises from '../pages/Exercises';
import AdminPanel from '../pages/AdminPanel';
//import Profile from '../pages/Profile';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


            {/* Rutas protegidas (requieren login)*/}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exercises" element={<Exercises />} />
                {/*<Route path="/routines" element={<Routines />} />
                <Route path="/profile" element={<Profile />} />*/}

                {/* Rutas de administración (requieren login + id_rol=3) */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
            </Route>


            {/* Ruta 404 
            <Route path="*" element={<NotFound />} />
            */}
        </Routes>
    );
}
