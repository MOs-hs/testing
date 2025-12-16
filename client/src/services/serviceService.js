import api from './api';

const serviceService = {
    // Get all services (with optional filters)
    getAll: async (params) => {
        const response = await api.get('/services', { params });
        return response.data;
    },

    // Get service by ID
    getById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    // Get services by provider
    getByProvider: async (providerId) => {
        const response = await api.get(`/services/provider/${providerId}`);
        return response.data;
    },

    // Create service (Provider only)
    create: async (data) => {
        const response = await api.post('/services', data);
        return response.data;
    },

    // Update service (Provider only)
    update: async (id, data) => {
        const response = await api.put(`/services/${id}`, data);
        return response.data;
    },

    // Delete service (Provider only)
    delete: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    }
};

export default serviceService;
