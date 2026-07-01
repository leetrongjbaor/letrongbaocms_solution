import axiosClient from '../api/axiosClient';

const bannerService = {
    getAll: async (activeOnly = false) => {
        const response = await axiosClient.get(`/Banners?activeOnly=${activeOnly}`);
        return response.data || response;
    },

    create: async (banner) => {
        const response = await axiosClient.post('/Banners', toFormData(banner), {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data || response;
    },

    update: async (id, banner) => {
        const response = await axiosClient.put(`/Banners/${id}`, toFormData(banner), {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data || response;
    },

    remove: async (id) => {
        const response = await axiosClient.delete(`/Banners/${id}`);
        return response.data || response;
    },
};

function toFormData(banner) {
    const formData = new FormData();
    formData.append('title', banner.title || '');
    formData.append('subtitle', banner.subtitle || '');
    formData.append('imageUrl', banner.imageUrl || '');
    formData.append('linkUrl', banner.linkUrl || '');
    formData.append('position', banner.position || 'Home');
    formData.append('displayOrder', banner.displayOrder ?? 0);
    formData.append('isActive', Boolean(banner.isActive));

    if (banner.imageFile) {
        formData.append('imageFile', banner.imageFile);
    }

    return formData;
}

export default bannerService;
