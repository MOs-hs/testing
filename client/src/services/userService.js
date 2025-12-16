import api from './api';

const userService = {
    // Get all users (Admin)
    getAll: async (params) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    // Update user by ID (Admin)
    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    // Delete user (Admin)
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;
