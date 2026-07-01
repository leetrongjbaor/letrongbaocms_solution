import React, { useEffect, useState } from 'react';
import productService from '../services/productService';
import { getImageUrl } from '../utils/imageHelper';

const ProductDetail = ({ productId, onBack, onAddToCart }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);
                setQuantity(1);
            } catch (error) {
                console.error('Loi khi tai chi tiet san pham:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchProductDetail();
    }, [productId]);

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-danger" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center my-5 py-5 bg-white rounded-lg shadow-sm" style={{ borderRadius: '16px' }}>
                <i className="fa-solid fa-circle-exclamation text-danger mb-3" style={{ fontSize: '3.5rem' }}></i>
                <h5 className="text-secondary fw-semibold">Không tìm thấy sản phẩm</h5>
                <p className="text-muted small">Sản phẩm này có thể đã ngừng kinh doanh hoặc liên kết bị hỏng.</p>
                <button onClick={onBack} className="btn btn-danger rounded-pill px-4 mt-3">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại cửa hàng
                </button>
            </div>
        );
    }

    const fallbackImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop';
    const imageUrl = getImageUrl(product.imageUrl, fallbackImage);
    const stockQuantity = Number(product.stockQuantity || 0);
    const inStock = stockQuantity > 0;

    const handleQuantityChange = (value) => {
        const nextQuantity = Math.max(1, Number(value) || 1);
        if (nextQuantity > stockQuantity) {
            alert('Số lượng sản phẩm trong kho không đủ!');
            setQuantity(stockQuantity || 1);
            return;
        }
        setQuantity(nextQuantity);
    };

    const handleAddToCart = () => {
        if (!inStock || quantity > stockQuantity) {
            alert('Số lượng sản phẩm trong kho không đủ!');
            return;
        }
        onAddToCart(product, quantity);
    };

    return (
        <div className="product-detail-shell">
            <style>{`
                .product-detail-shell {
                    background: #0d0d0f;
                    color: #fff;
                    padding: 28px;
                    border: 1px solid rgba(229, 9, 20, 0.22);
                    border-radius: 18px;
                    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
                }
                .detail-img-container {
                    aspect-ratio: 4 / 5;
                    border-radius: 16px;
                    overflow: hidden;
                    background-color: #171717;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .detail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .back-btn {
                    color: #d6d6d6;
                    font-weight: 700;
                    text-decoration: none !important;
                }
                .back-btn:hover {
                    color: #ff2d38;
                }
                .product-price-large {
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 900;
                    color: #ff2d38;
                }
                .detail-section-title {
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    color: #ff6b73;
                    text-transform: uppercase;
                }
                .detail-qty {
                    width: 124px;
                    height: 46px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    background: #171717;
                    color: #fff;
                    padding: 0 14px;
                    font-weight: 800;
                }
                .detail-cart-btn {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    border: 0;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 900;
                    min-height: 50px;
                    padding: 0 28px;
                }
                .detail-cart-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }
            `}</style>

            <button onClick={onBack} className="btn btn-link p-0 mb-4 back-btn d-flex align-items-center">
                <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại cửa hàng
            </button>

            <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="detail-img-container">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="detail-img"
                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                    </div>
                </div>

                <div className="col-md-6 pl-md-5">
                    <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'} px-3 py-2 rounded-pill mb-3`}>
                        {inStock ? `Còn hàng: ${stockQuantity}` : 'Hết hàng'}
                    </span>

                    <h2 className="font-weight-bold mb-3" style={{ fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.1 }}>
                        {product.name}
                    </h2>

                    <div className="product-price-large mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>

                    <div className="mb-4 border-top pt-4" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                        <h6 className="detail-section-title mb-2">Mô tả sản phẩm</h6>
                        <p className="text-light" style={{ lineHeight: 1.75, opacity: 0.82 }}>
                            {product.description || 'Sản phẩm thời trang được chọn lọc kỹ, phù hợp phong cách hiện đại và dễ phối đồ.'}
                        </p>
                    </div>

                    <div className="d-flex flex-wrap align-items-end pt-2" style={{ gap: '14px' }}>
                        <label className="mb-0">
                            <span className="d-block detail-section-title mb-2">Số lượng</span>
                            <input
                                type="number"
                                min="1"
                                max={stockQuantity || 1}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                                className="detail-qty"
                                disabled={!inStock}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="detail-cart-btn d-flex align-items-center justify-content-center"
                            disabled={!inStock}
                        >
                            <i className="fa-solid fa-cart-plus mr-2"></i>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
