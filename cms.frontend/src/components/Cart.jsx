import React from 'react';
import { getImageUrl } from '../utils/imageHelper';

const Cart = ({ cartItems, onBack, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const fallbackImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop';

    const formatVND = (amount) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (onCheckout) {
            onCheckout();
        }
    };

    const handleIncreaseQuantity = (item, maxQuantity) => {
        if (item.quantity >= maxQuantity) {
            alert(`Không thể mua thêm "${item.name}". Trong kho chỉ còn ${maxQuantity} sản phẩm.`);
            return;
        }

        onUpdateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className="cart-redesign">
            <section className="cart-hero-new">
                <button type="button" onClick={onBack}>
                    <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
                </button>
                <div>
                    <p>Giỏ hàng của bạn</p>
                    <h1>{totalItems > 0 ? `${totalItems} sản phẩm` : 'Chưa có sản phẩm'}</h1>
                </div>
                {cartItems.length > 0 && (
                    <button type="button" className="cart-clear-new" onClick={onClearCart}>
                        <i className="fas fa-trash"></i> Xóa tất cả
                    </button>
                )}
            </section>

            {cartItems.length === 0 ? (
                <section className="cart-empty-new">
                    <i className="fas fa-cart-shopping"></i>
                    <h2>Giỏ hàng đang trống</h2>
                    <p>Hãy quay lại cửa hàng và chọn thêm sản phẩm bạn thích.</p>
                    <button type="button" onClick={onBack}>
                        <i className="fas fa-store"></i> Khám phá cửa hàng
                    </button>
                </section>
            ) : (
                <div className="cart-layout-new">
                    <section className="cart-list-new">
                        {cartItems.map((item) => {
                            const imageUrl = getImageUrl(item.imageUrl, fallbackImage);
                            const maxQuantity = Number(item.stockQuantity || 99);

                            return (
                                <article className="cart-item-new" key={item.id}>
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        onError={(event) => { event.currentTarget.src = fallbackImage; }}
                                    />

                                    <div className="cart-item-new__body">
                                        <div className="cart-item-new__top">
                                            <div>
                                                <p>{item.categoryName || 'Gaming gear'}</p>
                                                <h3>{item.name}</h3>
                                            </div>
                                            <button type="button" onClick={() => onRemoveItem(item.id)} aria-label="Xóa sản phẩm">
                                                <i className="fas fa-xmark"></i>
                                            </button>
                                        </div>

                                        <div className="cart-item-new__bottom">
                                            <strong>{formatVND(item.price)}</strong>
                                            <div className="cart-qty-new">
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncreaseQuantity(item, maxQuantity)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span>{formatVND(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="cart-summary-new">
                        <p>Thanh toán</p>
                        <h2>Tóm tắt đơn hàng</h2>

                        <div className="cart-summary-row">
                            <span>Tạm tính</span>
                            <strong>{formatVND(totalPrice)}</strong>
                        </div>
                        <div className="cart-summary-row">
                            <span>Vận chuyển</span>
                            <strong className="free">Miễn phí</strong>
                        </div>
                        <div className="cart-summary-row">
                            <span>Giảm giá</span>
                            <strong>{formatVND(0)}</strong>
                        </div>

                        <div className="cart-summary-total">
                            <span>Tổng cộng</span>
                            <strong>{formatVND(totalPrice)}</strong>
                        </div>

                        <button type="button" className="cart-checkout-new" onClick={handleCheckout}>
                            <i className="fas fa-lock"></i> Đặt hàng ngay
                        </button>

                        <div className="cart-trust-new">
                            <span><i className="fas fa-shield-alt"></i> Thanh toán an toàn</span>
                            <span><i className="fas fa-truck"></i> Giao hàng toàn quốc</span>
                            <span><i className="fas fa-undo-alt"></i> Hỗ trợ đổi trả</span>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Cart;
