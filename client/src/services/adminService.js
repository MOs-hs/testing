import api from './api';

/**
 * Admin Service - Handles admin-related API calls
 */
const adminService = {
    /**
     * Get all pending provider requests
     * @returns {Promise<Array>} List of pending providers
     */
    getPendingProviders: async () => {
        const response = await api.get('/admin/providers/pending');
        return response.data;
    },

    /**
     * Approve a provider
     * @param {number} providerId - ID of the provider to approve
     * @returns {Promise<Object>} Response data
     */
    approveProvider: async (providerId) => {
        const response = await api.put(`/admin/providers/${providerId}/approve`);
        return response.data;
    },

    /**
     * Reject a provider
     * @param {number} providerId - ID of the provider to reject
     * @returns {Promise<Object>} Response data
     */
    rejectProvider: async (providerId) => {
        const response = await api.put(`/admin/providers/${providerId}/reject`);
        return response.data;
    },

    // Review management
    getAllReviews: async (params) => {
        const response = await api.get('/reviews', { params });
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    // Placeholder for other admin methods (reports, etc.)
    getDashboardStats: async () => {
        // TODO: Implement dashboard stats endpoint
        return {
            totalUsers: 0,
            totalProviders: 0,
            totalRequests: 0,
            revenue: 0
        };
    }
};

export default adminService;
