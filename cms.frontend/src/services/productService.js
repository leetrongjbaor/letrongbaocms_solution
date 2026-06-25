// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * 1. Lấy danh sách toàn bộ sản phẩm thời trang
     * API Endpoint: GET /Products
     */
    getAllProducts: async () => {
        try {
            const response = await axiosClient.get('/Products');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            throw error;
        }
    },

    /**
     * 2. Lấy danh sách sản phẩm theo danh mục
     * API Endpoint: GET /Products/categoryproduct/{categoryId}
     */
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await axiosClient.get(`/Products/categoryproduct/${categoryId}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductsByCategory với Category ID ${categoryId}:`, error);
            throw error;
        }
    },

    /**
     * 3. Lấy thông tin chi tiết của một sản phẩm theo ID
     * API Endpoint: GET /Products/{id}
     */
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    }
};

// CRITICAL: Xuất mặc định đối tượng này để file ProductGrid.jsx import vào không bị lỗi 'default was not found'
export default productService;
