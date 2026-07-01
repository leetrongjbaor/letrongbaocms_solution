const IMAGE_BASE_URL = "http://localhost:5029";

export const getImageUrl = (url, fallback) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return fallback;
    }
    
    // Check if the URL is just a number (like "1243" or "200")
    if (/^\d+$/.test(url.trim())) {
        return fallback;
    }

    const trimmedUrl = url.trim();

    // If it's already an absolute URL (http:// or https://), return it as is
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
    }

    // Ensure it starts with a slash
    const path = trimmedUrl.startsWith('/') ? trimmedUrl : '/' + trimmedUrl;
    
    return IMAGE_BASE_URL + path;
};
