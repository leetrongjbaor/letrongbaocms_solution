import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },
    getProductsByCategory: (categoryId) => {
        const url = `/Products/categoryproduct/${categoryId}`;
        return axiosClient.get(url);
    },
    getProductDetail: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    }
};

export default productService;