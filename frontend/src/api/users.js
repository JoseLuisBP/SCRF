import { get } from "react-hook-form";
import axiosInstance from "./axios";

const usersAPI = {
    // Obtener perfil del usuario actual
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/v1/users/me');
        return response.data;
    },

    // Actualizar perfil
    updateProfile: async profileData => {
        const response = await axiosInstance.put('/v1/users/me', profileData);
        if (response.data?.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Cambiar contraseña
    changePassword: async passwordData => {
        const response = await axiosInstance.post(
            '/v1/users/change-password',
            passwordData
        );
        return response.data;
    },

    // Eliminar cuenta
    deleteAccount: async () => {
        const response = await axiosInstance.delete('/v1/users/me');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    },

    //
    // Administración de usuarios (solo para admins)
    //
    // Obtener lista de usuarios
    getUsers: async () => {
        const response = await axiosInstance.get('/v1/users');
        return response.data;
    }

    // Faltan más funciones relacionadas con usuarios pueden añadirse aquí
}

export default usersAPI;