// import axios from 'axios';

// // const api = axios.create({
// //     baseURL: 'http://localhost:5000',
// //     withCredentials: true
// // });

// const api = axios.create({
//     baseURL: 'http://localhost:5000',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;











import axios from 'axios';
import { toast } from 'react-toastify';

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
    configuredApiUrl ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');

export const buildApiUrl = (path) => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const base = API_BASE_URL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
};

const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
            toast.error('Session expired. Please login again.');
        }
        
        return Promise.reject(error);
    }
);

export default instance;
