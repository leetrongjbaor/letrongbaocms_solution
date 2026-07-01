import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ activeId, onSelectCategory }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);

                // Mặc định chọn danh mục đầu tiên nếu danh sách không trống và chưa có activeId
                if (data && data.length > 0 && activeId === null) {
                    onSelectCategory(data[0].id);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4 py-3">
                <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2 text-muted small">Đang tải danh mục sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <style>{`
                .custom-category-item {
                    transition: all 0.25s ease-in-out !important;
                    border-left: 3px solid transparent !important;
                    font-weight: 500;
                }
                
                /* Trạng thái Hover HOẶC trạng thái Active (Đang được chọn) */
                .custom-category-item:hover,
                .custom-category-item.is-active {
                    background-color: rgba(229, 9, 20, 0.12) !important; /* Màu nền xanh dương siêu nhẹ */
                    color: #ff2d38 !important;
                    padding-left: 1.75rem !important;
                    border-left-color: #e50914 !important;
                }
                
                .custom-category-item:hover .fa-chevron-right,
                .custom-category-item.is-active .fa-chevron-right {
                    transform: translateX(3px);
                    color: #ff2d38 !important;
                    opacity: 1 !important;
                }
                
                .fa-chevron-right {
                    transition: all 0.2s ease;
                }
                .mr-2 {
                    margin-right: 0.5rem !important;
                }
            `}</style>

            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary mr-2" style={{ fontSize: '1.3rem' }}></i> Danh mục SP
                </h5>
            </div>

            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {/* Thêm nút "Tất cả sản phẩm" */}
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 custom-category-item ${activeId === '' ? 'is-active' : ''}`}
                        style={{ fontSize: '0.95rem', color: '#495057' }}
                        onClick={() => onSelectCategory('')}
                    >
                        <span className={activeId === '' ? "fw-bold" : "font-weight-normal"}>
                            Tất cả sản phẩm
                        </span>
                        <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                    </button>

                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 custom-category-item ${activeId === item.id ? 'is-active' : ''}`}
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                                onClick={() => onSelectCategory(item.id)}
                            >
                                <span className={activeId === item.id ? "fw-bold" : "font-weight-normal"}>
                                    {item.name}
                                </span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;
