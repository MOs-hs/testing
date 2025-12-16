import { toast } from 'react-toastify';

// Toast configuration
const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const showSuccess = (message) => {
    toast.success(message, toastConfig);
};

export const showError = (message) => {
    toast.error(message, toastConfig);
};

export const showInfo = (message) => {
    toast.info(message, toastConfig);
};

export const showWarning = (message) => {
    toast.warning(message, toastConfig);
};

// Helper to show API error
export const showApiError = (error) => {
    const message = error?.error || error?.message || 'An error occurred';
    toast.error(message, toastConfig);
};
