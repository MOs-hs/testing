import api from './api';

export const contactService = {
    // Send a message
    sendMessage: async (data) => {
        const response = await api.post('/contact', data);
        return response.data;
    },

    // Get all messages (Admin only)
    getAllMessages: async (page = 1, limit = 10) => {
        const response = await api.get(`/contact?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Delete a message (Admin only)
    deleteMessage: async (id) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    }
};
