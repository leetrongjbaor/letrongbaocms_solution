import axiosClient from '../api/axiosClient';

const customerService = {
    /**
     * Đăng ký khách hàng mới
     * POST /Customers/register
     */
    register: async (customerData) => {
        try {
            const response = await axiosClient.post('/Customers/register', customerData);
            return response;
        } catch (error) {
            console.error("Lỗi API register customer:", error);
            throw error;
        }
    },

    /**
     * Đăng nhập khách hàng
     * POST /Customers/login
     */
    login: async (email, password) => {
        try {
            const response = await axiosClient.post('/Customers/login', { email, password });
            return response;
        } catch (error) {
            console.error("Lỗi API login customer:", error);
            throw error;
        }
    },

    /**
     * Cập nhật thông tin hồ sơ khách hàng
     * PUT /Customers/{id}
     */
    updateProfile: async (id, data) => {
        try {
            const response = await axiosClient.put(`/Customers/${id}`, data);
            return response;
        } catch (error) {
            console.error("Lỗi API update profile:", error);
            throw error;
        }
    }
};

export default customerService;
