import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Helper to determine base URL dynamically on client vs server
const getInitialBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

// Create Axios Instance
export const api: AxiosInstance = axios.create({
  baseURL: getInitialBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor to automatically resolve LAN hostname & attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // Dynamic API URL Resolution for Mobile / LAN IP Access (e.g. 192.168.x.x)
      if (process.env.NEXT_PUBLIC_API_URL) {
        config.baseURL = process.env.NEXT_PUBLIC_API_URL;
      } else if (window.location.hostname) {
        config.baseURL = `http://${window.location.hostname}:5000`;
      }

      const token = localStorage.getItem('real_acc_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for uniform error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError = {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Network error or server unreachable. Please check backend connection.',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
