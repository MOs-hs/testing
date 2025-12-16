import api from './api';

const requestService = {
    // Get all requests (for current user)
    getAll: async () => {
        const response = await api.get('/requests');
        return response.data;
    },

    // Get request by ID
    getById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    // Create new request
    create: async (data) => {
        const response = await api.post('/requests', data);
        return response.data;
    },

    // Update request status
    updateStatus: async (id, status) => {
        const response = await api.put(`/requests/${id}/status`, { status });
        return response.data;
    }
};

export default requestService;
