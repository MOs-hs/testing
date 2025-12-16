import api from './api';

const providerService = {
    // Get all providers (with filters)
    getAll: async (params) => {
        const response = await api.get('/providers', { params });
        return response.data;
    },

    // Get provider by ID
    getById: async (id) => {
        const response = await api.get(`/providers/${id}`);
        return response.data;
    },

    // Get provider profile (current user)
    getProfile: async () => {
        const response = await api.get('/providers/profile/me');
        return response.data;
    },

    // Update provider profile
    updateProfile: async (data) => {
        const response = await api.put('/providers/profile', data);
        return response.data;
    },

    // Verify provider (Admin)
    verify: async (id) => {
        const response = await api.put(`/providers/${id}/verify`);
        return response.data;
    }
};

export default providerService;
