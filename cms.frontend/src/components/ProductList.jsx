import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ selectedCategoryId, onViewDetail }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];
                if (selectedCategoryId) {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategoryId]);

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-dark product-spinner" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted fw-light">Đang tìm kiếm sản phẩm phù hợp...</p>
            </div>
        );
    }

    return (
        <div>
            {/* HỆ THỐNG CSS CHUYÊN NGHIỆP - PHONG CÁCH E-COMMERCE CAO CẤP */}
            <style>{`
                .product-spinner {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-width: 0.2em;
                }
                .product-empty-icon {
                    font-size: 3rem;
                    color: #cbd5e1 !important;
                }
                .product-card {
                    border: none;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #ffffff;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 16px rgba(0, 0, 0, 0.04);
                }
                .product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                .product-img-wrapper {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3 / 4; /* Tỷ lệ vàng hiển thị phom dáng sản phẩm thời trang chuyên nghiệp */
                    overflow: hidden;
                    background-color: #f8fafc;
                }
                .product-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .product-card:hover .product-img {
                    transform: scale(1.05);
                }
                .product-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 4px 10px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background-color: rgba(255, 255, 255, 0.95) !important;
                    color: #0f172a !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }
                .product-price {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #0f172a;
                    letter-spacing: -0.2px;
                }
                .product-title {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #1e293b;
                    line-height: 1.4;
                    height: 2.8em;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    transition: color 0.2s ease;
                }
                .product-card:hover .product-title {
                    color: #4f46e5; /* Đổi màu nhẹ khi hover card */
                }
                .stock-badge {
                    display: inline-flex;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #64748b;
                    background: #f8fafc;
                    padding: 2px 8px;
                    border-radius: 20px;
                }
                .stock-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-right: 6px;
                }
                .stock-in { background-color: #10b981; }
                .stock-out { background-color: #ef4444; }
                
                .product-detail-btn {
                    font-size: 0.8rem;
                    font-weight: 600;
                    background-color: #0f172a !important; /* Màu đen sang trọng thay vì màu xanh cơ bản */
                    border: none !important;
                    padding: 8px 16px !important;
                    transition: all 0.2s ease;
                }
                .product-detail-btn:hover {
                    background-color: #4f46e5 !important; /* Chuyển Indigo thời thượng */
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
                }
                .product-detail-btn i {
                    transition: transform 0.2s ease;
                }
                .product-detail-btn:hover i {
                    transform: translateX(3px); /* Hiệu ứng đẩy mũi tên nhẹ */
                }
            `}</style>

            <div className="row g-4"> {/* Dùng g-4 của Bootstrap để khoảng cách giữa các card đều và thoáng hơn */}
                {products.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <div className="mb-3">
                            <i className="fa-regular fa-folder-open product-empty-icon"></i>
                        </div>
                        <h5 className="text-secondary fw-semibold">Không tìm thấy sản phẩm</h5>
                        <p className="text-muted small fw-light">Danh mục này hiện chưa có sản phẩm nào. Vui lòng quay lại sau!</p>
                    </div>
                ) : (
                    products.map((item) => {
                        const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop";
                        const imageUrl = item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : fallbackImage;
                        const inStock = item.stockQuantity > 0;

                        return (
                            <div className="col-sm-6 col-lg-4 mb-2" key={item.id}>
                                <div className="card h-100 product-card">
                                    <div className="product-img-wrapper">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="product-img"
                                            onError={(e) => { e.target.src = fallbackImage; }}
                                        />
                                        {item.categoryName && (
                                            <span className="badge product-badge">
                                                {item.categoryName}
                                            </span>
                                        )}
                                    </div>
                                    <div className="card-body d-flex flex-column p-3 pt-4">
                                        <h5 className="product-title mb-2" title={item.name}>
                                            {item.name}
                                        </h5>

                                        <div className="d-flex align-items-center mb-3">
                                            <span className="stock-badge">
                                                <span className={`stock-dot ${inStock ? 'stock-in' : 'stock-out'}`}></span>
                                                {inStock ? `Còn hàng: ${item.stockQuantity}` : 'Hết hàng'}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-2 d-flex align-items-center justify-content-between">
                                            <div className="product-price">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.price)}
                                            </div>
                                            <button
                                                onClick={() => onViewDetail(item.id)}
                                                className="btn btn-dark btn-sm rounded-pill product-detail-btn"
                                            >
                                                Chi tiết <i className="fa-solid fa-arrow-right ms-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProductList;