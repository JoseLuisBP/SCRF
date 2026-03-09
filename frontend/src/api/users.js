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
        localStorage.removeItem('id_rol');
        return response.data;
    },

    //
    // Administración de usuarios (solo para admins, id_rol=3)
    //

    // Obtener lista completa de usuarios
    getAdminUsers: async (skip = 0, limit = 100) => {
        const response = await axiosInstance.get('/v1/admin/users', {
            params: { skip, limit }
        });
        return response.data;
    },

    // Crear nuevo administrador (requiere id_rol=3 en el token)
    createAdmin: async (adminData) => {
        const response = await axiosInstance.post('/v1/admin/create-admin', adminData);
        return response.data;
    },

    // Obtener lista de usuarios (endpoint antiguo, solo admin)
    // Mantenido por retrocompatibilidad — usar getAdminUsers() en nuevo código
    // getUsers: async () => {
    //     const response = await axiosInstance.get('/v1/users');
    //     return response.data;
    // }
};

export default usersAPI;
