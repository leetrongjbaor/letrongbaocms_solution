import React from 'react';
import { getImageUrl } from '../utils/imageHelper';

const Cart = ({ cartItems, onBack, onUpdateQuantity, onRemoveItem, onClearCart }) => {

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Format tiền VND
    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Xử lý đặt hàng
    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        alert(`🎉 Đặt hàng thành công!\n\nTổng ${totalItems} sản phẩm\nThành tiền: ${formatVND(totalPrice)}\n\nCảm ơn bạn đã mua sắm tại Fashion Boutique!`);
        onClearCart();
    };

    const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop";

    return (
        <div className="cart-page">
            <style>{`
                /* ===== CART PAGE STYLES ===== */
                .cart-page {
                    animation: cartFadeIn 0.4s ease;
                }
                @keyframes cartFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .cart-back-btn {
                    color: #475569;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: all 0.2s ease;
                    background: none;
                    border: none;
                    padding: 0;
                }
                .cart-back-btn:hover {
                    color: #0f172a;
                    transform: translateX(-4px);
                }

                .cart-header-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 1.3rem;
                }

                .cart-item-card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(0,0,0,0.04);
                }
                .cart-item-card:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }

                .cart-item-img {
                    width: 100px;
                    height: 100px;
                    border-radius: 12px;
                    object-fit: cover;
                    background: #f8fafc;
                    flex-shrink: 0;
                }

                .cart-item-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #0f172a;
                    margin-bottom: 4px;
                    line-height: 1.4;
                }

                .cart-item-category {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .cart-item-price {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #0f172a;
                }

                .cart-item-subtotal {
                    font-size: 0.85rem;
                    color: #64748b;
                    font-weight: 500;
                }

                /* Quantity Controls */
                .qty-control {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 10px;
                    background: #f1f5f9;
                    overflow: hidden;
                }
                .qty-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #334155;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s ease;
                }
                .qty-btn:hover {
                    background: #e2e8f0;
                    color: #0f172a;
                }
                .qty-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .qty-value {
                    width: 40px;
                    text-align: center;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #0f172a;
                    background: transparent;
                }

                .cart-remove-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: none;
                    background: #fef2f2;
                    color: #ef4444;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .cart-remove-btn:hover {
                    background: #fee2e2;
                    transform: scale(1.1);
                }

                /* Summary Panel */
                .cart-summary {
                    background: #fff;
                    border-radius: 20px;
                    padding: 28px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.06);
                    border: 1px solid rgba(0,0,0,0.04);
                    position: sticky;
                    top: 100px;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                }
                .summary-label {
                    color: #64748b;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                .summary-value {
                    color: #0f172a;
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .summary-total {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                }

                .checkout-btn {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #fff;
                    font-size: 1.05rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    letter-spacing: 0.3px;
                }
                .checkout-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
                    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
                    transform: translateY(-2px);
                }
                .checkout-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .continue-shopping-btn {
                    width: 100%;
                    padding: 14px;
                    border: 2px solid #e2e8f0;
                    border-radius: 14px;
                    background: transparent;
                    color: #475569;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .continue-shopping-btn:hover {
                    border-color: #0f172a;
                    color: #0f172a;
                    background: #f8fafc;
                }

                .cart-empty-icon {
                    font-size: 5rem;
                    color: #cbd5e1;
                    margin-bottom: 20px;
                }
                .cart-empty-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 8px;
                }
                .cart-empty-text {
                    color: #94a3b8;
                    font-size: 0.95rem;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .clear-cart-btn {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #ef4444;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 4px 8px;
                    border-radius: 8px;
                }
                .clear-cart-btn:hover {
                    background: #fef2f2;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .cart-item-img {
                        width: 80px;
                        height: 80px;
                    }
                    .cart-item-card {
                        padding: 16px;
                    }
                    .cart-summary {
                        position: static;
                    }
                }
            `}</style>

            {/* Back Button */}
            <div className="mb-4">
                <button onClick={onBack} className="cart-back-btn d-flex align-items-center">
                    <i className="fa-solid fa-arrow-left me-2"></i> Tiếp tục mua sắm
                </button>
            </div>

            {/* Cart Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <div className="cart-header-icon me-3">
                        <i className="fa-solid fa-bag-shopping"></i>
                    </div>
                    <div>
                        <h3 className="mb-0 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                            Giỏ hàng của bạn
                        </h3>
                        <p className="mb-0 text-muted small">
                            {totalItems > 0 ? `${totalItems} sản phẩm` : 'Chưa có sản phẩm nào'}
                        </p>
                    </div>
                </div>
                {cartItems.length > 0 && (
                    <button onClick={onClearCart} className="clear-cart-btn">
                        <i className="fa-solid fa-trash me-1"></i> Xóa tất cả
                    </button>
                )}
            </div>

            {/* Empty Cart */}
            {cartItems.length === 0 ? (
                <div className="text-center py-5" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.06)' }}>
                    <div className="py-5">
                        <i className="fa-solid fa-cart-shopping cart-empty-icon"></i>
                        <h4 className="cart-empty-title">Giỏ hàng trống</h4>
                        <p className="cart-empty-text mb-4">
                            Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá bộ sưu tập thời trang mới nhất của chúng tôi!
                        </p>
                        <button onClick={onBack} className="btn btn-dark btn-lg rounded-pill px-5 py-3 fw-bold" style={{ fontSize: '0.95rem' }}>
                            <i className="fa-solid fa-store me-2"></i> Khám phá cửa hàng
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {/* Left Column: Cart Items */}
                    <div className="col-lg-8 mb-4">
                        {cartItems.map((item) => {
                            const imageUrl = getImageUrl(item.imageUrl, fallbackImage);

                            return (
                                <div className="cart-item-card" key={item.id}>
                                    <div className="d-flex align-items-center">
                                        {/* Product Image */}
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="cart-item-img me-3"
                                            onError={(e) => { e.target.src = fallbackImage; }}
                                        />

                                        {/* Product Info */}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="me-3" style={{ flex: 1 }}>
                                                    <div className="cart-item-name">{item.name}</div>
                                                    <div className="cart-item-category">
                                                        {item.categoryName || 'Thời trang'}
                                                    </div>
                                                    <div className="cart-item-price mt-2">
                                                        {formatVND(item.price)}
                                                    </div>
                                                </div>

                                                {/* Remove Button (mobile-hidden, shown at end) */}
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="cart-remove-btn d-none d-md-flex"
                                                    title="Xóa khỏi giỏ hàng"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>

                                            {/* Quantity + Subtotal Row */}
                                            <div className="d-flex align-items-center justify-content-between mt-3">
                                                <div className="qty-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="qty-value">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= (item.stockQuantity || 99)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <span className="cart-item-subtotal me-3">
                                                        {formatVND(item.price * item.quantity)}
                                                    </span>
                                                    {/* Remove Button (mobile) */}
                                                    <button
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="cart-remove-btn d-flex d-md-none"
                                                        title="Xóa"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="col-lg-4">
                        <div className="cart-summary">
                            <h5 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                                <i className="fa-solid fa-receipt me-2 text-muted"></i>
                                Tóm tắt đơn hàng
                            </h5>

                            <div className="summary-row">
                                <span className="summary-label">Tạm tính ({totalItems} sản phẩm)</span>
                                <span className="summary-value">{formatVND(totalPrice)}</span>
                            </div>

                            <div className="summary-row">
                                <span className="summary-label">Phí vận chuyển</span>
                                <span className="summary-value" style={{ color: '#10b981' }}>Miễn phí</span>
                            </div>

                            <div className="summary-row">
                                <span className="summary-label">Giảm giá</span>
                                <span className="summary-value">0 ₫</span>
                            </div>

                            <hr style={{ borderColor: '#e2e8f0' }} />

                            <div className="summary-row mb-4">
                                <span className="summary-label fw-bold" style={{ color: '#0f172a', fontSize: '1rem' }}>Tổng cộng</span>
                                <span className="summary-total">{formatVND(totalPrice)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="checkout-btn mb-3"
                                disabled={cartItems.length === 0}
                            >
                                <i className="fa-solid fa-lock me-2"></i>
                                Đặt hàng ngay
                            </button>

                            <button onClick={onBack} className="continue-shopping-btn">
                                <i className="fa-solid fa-arrow-left me-2"></i>
                                Tiếp tục mua sắm
                            </button>

                            {/* Trust badges */}
                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fa-solid fa-shield-halved text-muted me-2" style={{ fontSize: '0.85rem' }}></i>
                                    <span className="small text-muted">Thanh toán an toàn & bảo mật</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fa-solid fa-truck-fast text-muted me-2" style={{ fontSize: '0.85rem' }}></i>
                                    <span className="small text-muted">Giao hàng toàn quốc 2-5 ngày</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-rotate-left text-muted me-2" style={{ fontSize: '0.85rem' }}></i>
                                    <span className="small text-muted">Đổi trả miễn phí trong 30 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
