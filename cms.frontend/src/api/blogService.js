import axiosClient from '../api/axiosClient';

const blogService = {
    getAllPosts: () => axiosClient.get('/Posts'),
    getPostById: (id) => axiosClient.get(`/Posts/${id}`),
    getBlogCategories: () => axiosClient.get('/Categories'),
};

export default blogService;