import api from './api';

const categoryService = {
    // Get all categories
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // Get category by ID
    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Create category (Admin only)
    create: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    // Update category (Admin only)
    update: async (id, data) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    // Delete category (Admin only)
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

export default categoryService;
