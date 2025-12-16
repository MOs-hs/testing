import api from './api';

const paymentService = {
    // Get all payments (Admin/User specific handled by backend)
    getAll: async () => {
        const response = await api.get('/payments');
        return response.data;
    },

    // Get payment by ID
    getById: async (id) => {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    },

    // Create payment
    create: async (data) => {
        const response = await api.post('/payments', data);
        return response.data;
    },

    // Update payment status
    updateStatus: async (id, status) => {
        const response = await api.put(`/payments/${id}/status`, { paymentStatus: status });
        return response.data;
    }
};

export default paymentService;
