import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
