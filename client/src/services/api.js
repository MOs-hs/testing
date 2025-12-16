import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (status === 403) {
                // Forbidden
                console.error('Access denied');
            } else if (status === 429) {
                // Rate limit exceeded
                console.error('Too many requests. Please try again later.');
            }

            return Promise.reject(data || error.message);
        } else if (error.request) {
            // Request made but no response
            console.error('Network error. Please check your connection.');
            return Promise.reject({ error: 'Network error' });
        } else {
            // Something else happened
            return Promise.reject({ error: error.message });
        }
    }
);

export default api;
