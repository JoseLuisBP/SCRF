import axiosInstance from "./axios";

const usersAPI = {
    // ─── Perfil del usuario actual ────────────────────────────────────────────

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/v1/users/me');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await axiosInstance.put('/v1/users/me', profileData);
        if (response.data?.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    changePassword: async (passwordData) => {
        const payload = {
            contrasena_actual: passwordData.currentPassword,
            nueva_contrasena: passwordData.newPassword,
        };
        const response = await axiosInstance.post('/v1/users/me/change-password', payload);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await axiosInstance.delete('/v1/users/me');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('id_rol');
        return response.data;
    },

    // ─── Administración de usuarios (id_rol=3) ────────────────────────────────

    getAdminUsers: async (skip = 0, limit = 200) => {
        const response = await axiosInstance.get('/v1/admin/users', {
            params: { skip, limit }
        });
        return response.data;
    },

    createAdmin: async (adminData) => {
        const response = await axiosInstance.post('/v1/admin/create-admin', adminData);
        return response.data;
    },

    activateUser: async (userId) => {
        const response = await axiosInstance.post(`/v1/users/${userId}/activate`);
        return response.data;
    },

    deactivateUser: async (userId) => {
        const response = await axiosInstance.post(`/v1/users/${userId}/deactivate`);
        return response.data;
    },

    changeUserRole: async (userId, rolId) => {
        const response = await axiosInstance.put(`/v1/admin/users/${userId}/role`, { id_rol: rolId });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axiosInstance.delete(`/v1/admin/users/${userId}`);
        return response.data;
    },

    // ─── Estadísticas y auditoría ─────────────────────────────────────────────

    getStats: async () => {
        const response = await axiosInstance.get('/v1/admin/stats');
        return response.data;
    },

    getAuditLogs: async (skip = 0, limit = 50) => {
        const response = await axiosInstance.get('/v1/admin/audit-logs', {
            params: { skip, limit }
        });
        return response.data;
    },
};

export default usersAPI;
