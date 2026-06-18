import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDetail = ({ productId, onBack, onAddToCart }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductDetail(productId);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải thông tin chi tiết sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center my-5 py-5 bg-white rounded-lg shadow-sm" style={{ borderRadius: '16px' }}>
                <i className="fa-solid fa-circle-exclamation text-danger mb-3" style={{ fontSize: '3.5rem' }}></i>
                <h5 className="text-secondary fw-semibold">Không tìm thấy sản phẩm</h5>
                <p className="text-muted small">Sản phẩm này có thể đã ngừng kinh doanh hoặc liên kết bị hỏng.</p>
                <button onClick={onBack} className="btn btn-primary rounded-pill px-4 mt-3">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại cửa hàng
                </button>
            </div>
        );
    }

    const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop";
    const imageUrl = product.imageUrl && product.imageUrl.trim() !== "" ? product.imageUrl : fallbackImage;
    const inStock = product.stockQuantity > 0;

    return (
        <div className="bg-white p-4 p-md-5 rounded-lg shadow-sm" style={{ borderRadius: '16px' }}>
            <style>{`
                .detail-img-container {
                    height: 450px;
                    border-radius: 20px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.05);
                }
                .detail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .back-btn {
                    color: #475569;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    color: #0d6efd;
                    transform: translateX(-4px);
                }
                .product-price-large {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #dc3545;
                }
                .section-header-title {
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
            `}</style>

            {/* Back Button */}
            <div className="mb-4 d-inline-block">
                <button onClick={onBack} className="btn btn-link p-0 back-btn d-flex align-items-center">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại cửa hàng
                </button>
            </div>

            <div className="row align-items-center">
                {/* Product Image */}
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="detail-img-container">
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="detail-img"
                            onError={(e) => { e.target.src = fallbackImage; }}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="col-md-6 pl-md-5">
                    <span className="badge badge-primary px-3 py-1 rounded-pill mb-3 text-uppercase font-weight-bold" style={{ fontSize: '0.75rem' }}>
                        Sản phẩm thời trang
                    </span>
                    <h2 className="font-weight-bold text-dark mb-3" style={{ fontSize: '2.2rem', lineHeight: '1.2' }}>
                        {product.name}
                    </h2>
                    
                    <div className="d-flex align-items-center mb-4">
                        <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'} px-3 py-2 rounded-pill font-weight-semibold`} style={{ fontSize: '0.85rem' }}>
                            <i className={`fa-solid ${inStock ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}></i>
                            {inStock ? `Còn hàng (Tồn kho: ${product.stockQuantity})` : 'Hết hàng'}
                        </span>
                    </div>

                    <div className="product-price-large mb-4">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(product.price)}
                    </div>

                    <div className="mb-4 border-top pt-4">
                        <h6 className="section-header-title mb-2">Mô tả sản phẩm</h6>
                        <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '1rem' }}>
                            {product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Sản phẩm cao cấp được may đo thiết kế thủ công tỉ mỉ bằng các sợi vải mềm mại nhất từ bộ sưu tập độc quyền của Fashion Boutique."}
                        </p>
                    </div>

                    <div className="d-flex flex-wrap pt-3" style={{ gap: '15px' }}>
                        <button 
                            onClick={() => onAddToCart(product)}
                            className="btn btn-primary btn-lg rounded-pill px-5 py-3 font-weight-bold flex-grow-1 flex-md-grow-0 d-flex align-items-center justify-content-center"
                            disabled={!inStock}
                            style={{ fontSize: '1rem', boxShadow: '0 8px 20px rgba(13,110,253,0.3)' }}
                        >
                            <i className="fa-solid fa-cart-plus mr-2" style={{ fontSize: '1.1rem' }}></i>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
