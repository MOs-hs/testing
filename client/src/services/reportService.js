import api from './api';

const reportService = {
    // Get all reports (Admin)
    getAll: async () => {
        const response = await api.get('/admin/reports');
        return response.data;
    },

    // Generate report
    create: async (data) => {
        const response = await api.post('/admin/reports', data);
        return response.data;
    }
};

export default reportService;
