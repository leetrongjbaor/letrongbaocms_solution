import React, { useEffect, useState } from 'react';
import categoryProductService from '../../services/categoryProductService';
import { getImageUrl } from '../../utils/imageHelper';

const categoryFallbackImages = [
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
];

function CategoryMenu({ activeCategoryId, onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data || []);
            } catch (error) {
                console.error('Không thể tải danh mục sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id) => {
        if (onCategorySelect) onCategorySelect(id);
    };

    if (loading) {
        return (
            <section className="home-category-showcase">
                <div className="container">
                    <div className="category-showcase-loading">
                        <span></span>
                        <p>Đang tải danh mục...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="category-menu-section" className="home-category-showcase">
            <div className="container">
                <div className="category-showcase-head">
                    <div>
                        <p>Danh Mục</p>
                    </div>
                    <span>Click để lọc nhanh sản phẩm</span>
                </div>

                <div className="category-showcase-grid">
                    <button
                        type="button"
                        className={`category-tile ${activeCategoryId === null ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(null)}
                    >
                        <span className="category-tile__image category-tile__all">
                            <i className="fas fa-th-large"></i>
                        </span>
                        <strong>Tất cả</strong>
                        <small>Xem toàn bộ sản phẩm</small>
                    </button>

                    {categories.map((cat, index) => {
                        const fallback = categoryFallbackImages[index % categoryFallbackImages.length];
                        const imageUrl = getImageUrl(cat.imageUrl || cat.thumbnailUrl || cat.avatarUrl, fallback);

                        return (
                            <button
                                type="button"
                                className={`category-tile ${activeCategoryId === cat.id ? 'active' : ''}`}
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                <span className="category-tile__image">
                                    <img
                                        src={imageUrl}
                                        alt={cat.name}
                                        onError={(event) => { event.currentTarget.src = fallback; }}
                                    />
                                </span>
                                <strong>{cat.name}</strong>
                                <small>Chọn danh mục</small>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
