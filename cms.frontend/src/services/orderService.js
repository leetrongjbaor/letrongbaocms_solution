import axiosClient from '../api/axiosClient';

const orderService = {
    /**
     * Lấy danh sách đơn hàng theo mã khách hàng
     * GET /Orders/customer/{customerId}
     */
    getOrdersByCustomer: async (customerId) => {
        try {
            const response = await axiosClient.get(`/Orders/customer/${customerId}`);
            return response;
        } catch (error) {
            console.error("Lỗi API lấy đơn hàng theo khách hàng:", error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết sản phẩm trong đơn hàng
     * GET /OrderDetails/order/{orderId}
     */
    getOrderDetails: async (orderId) => {
        try {
            const response = await axiosClient.get(`/OrderDetails/order/${orderId}`);
            return response;
        } catch (error) {
            console.error("Lỗi API lấy chi tiết đơn hàng:", error);
            throw error;
        }
    }
};

export default orderService;
