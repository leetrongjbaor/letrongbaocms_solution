import axiosClient from '../api/axiosClient';

const normalizeCategoryProducts = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.value)) return response.value;
    if (Array.isArray(response?.items)) return response.items;
    return [];
};

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: async () => {
        const response = await axiosClient.get('/CategoriesProducts');
        return normalizeCategoryProducts(response);
    }
};

export default categoryProductService;
