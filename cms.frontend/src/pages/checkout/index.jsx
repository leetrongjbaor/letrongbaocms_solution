import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axiosClient from '../../api/axiosClient';
import { getImageUrl } from '../../utils/imageHelper';

const fallbackImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop';

function Checkout() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD'); // COD hoặc BANK

    useEffect(() => {
        // 1. Kiểm tra đăng nhập
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            alert('Vui lòng đăng nhập tài khoản khách hàng để thực hiện thanh toán!');
            navigate('/login');
            return;
        }

        const parsedCustomer = JSON.parse(storedCustomer);
        setCustomer(parsedCustomer);
        setFullName(parsedCustomer.fullName || '');
        setPhone(parsedCustomer.phone || '');
        setAddress(parsedCustomer.address || '');

        // 2. Kiểm tra giỏ hàng
        const storedCart = localStorage.getItem('cart');
        if (!storedCart || JSON.parse(storedCart).length === 0) {
            alert('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
            navigate('/shop');
            return;
        }

        setCartItems(JSON.parse(storedCart));
    }, [navigate]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!fullName.trim() || !phone.trim() || !address.trim()) {
            alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
            return;
        }

        try {
            setLoading(true);

            // Chuẩn bị DTO gửi lên Backend
            const orderData = {
                customerId: customer.id,
                notes: `SĐT: ${phone} | Địa chỉ giao hàng: ${address} | Ghi chú khách: ${notes} | Thanh toán: ${paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}`,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            // Gọi API tạo đơn hàng mới
            const response = await axiosClient.post('/Orders', orderData);

            alert(`🎉 Đặt hàng thành công!\nMã đơn hàng của bạn là: #${response.orderId || response.Id || 'N/A'}\n\nCảm ơn bạn đã tin dùng Fashion Boutique!`);

            // Xóa giỏ hàng và đồng bộ badge
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));

            // Quay về trang chủ
            navigate('/');
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert("Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    if (!customer || cartItems.length === 0) {
        return null; // Đang chuyển hướng
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <style>{`
                        .checkout-title {
                            font-weight: 800;
                            letter-spacing: -0.5px;
                            color: var(--gh-text);
                        }
                        .checkout-card {
                            background: linear-gradient(180deg, var(--gh-card-2), var(--gh-card));
                            border: 1px solid var(--gh-border-red);
                            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
                            border-radius: 20px;
                            color: var(--gh-text);
                        }
                        .checkout-card hr,
                        .checkout-card .border-top {
                            border-color: rgba(255, 255, 255, 0.09) !important;
                        }
                        .payment-method-option {
                            border: 2px solid var(--gh-border-red);
                            background-color: rgba(255, 255, 255, 0.02);
                            border-radius: 12px;
                            padding: 16px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            color: var(--gh-text);
                        }
                        .payment-method-option.selected {
                            border-color: var(--gh-red) !important;
                            background-color: rgba(229, 9, 20, 0.15) !important;
                        }
                        .checkout-item-row {
                            border-bottom: 1px solid rgba(255, 255, 255, 0.09);
                            padding-bottom: 12px;
                            margin-bottom: 12px;
                        }
                        .checkout-item-row:last-child {
                            border-bottom: none;
                            padding-bottom: 0;
                            margin-bottom: 0;
                        }
                        .confirm-btn {
                            background: linear-gradient(135deg, var(--gh-red) 0%, var(--gh-red-dark) 100%) !important;
                            border: none;
                            font-weight: 700;
                            box-shadow: 0 8px 20px rgba(229, 9, 20, 0.25);
                            transition: all 0.2s;
                        }
                        .confirm-btn:hover:not(:disabled) {
                            transform: translateY(-2px);
                            box-shadow: 0 10px 25px rgba(229,9,20,0.35);
                        }
                    `}</style>

                    <h2 className="mb-4 checkout-title">🛒 THÀNH TOÁN ĐƠN HÀNG</h2>

                    <form onSubmit={handleSubmitOrder} className="row">
                        {/* Cột trái: Thông tin giao hàng & Thanh toán */}
                        <div className="col-lg-7 mb-4">
                            <div className="checkout-card p-4 p-md-5">
                                <h5 className="font-weight-bold mb-4 text-white">
                                    <i className="fa-solid fa-truck-fast text-primary mr-2"></i> Thông Tin Giao Hàng
                                </h5>

                                <div className="form-group mb-3">
                                    <label className="small text-muted font-weight-bold">Họ và Tên người nhận</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg rounded-lg border-2"
                                        placeholder="Nhập họ và tên đầy đủ"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="small text-muted font-weight-bold">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg rounded-lg border-2"
                                        placeholder="Nhập số điện thoại liên hệ"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="small text-muted font-weight-bold">Địa chỉ giao hàng</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg rounded-lg border-2"
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="small text-muted font-weight-bold">Ghi chú giao hàng (Không bắt buộc)</label>
                                    <textarea
                                        className="form-control rounded-lg border-2"
                                        rows="3"
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi giao 15 phút..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <h5 className="font-weight-bold mb-4 pt-3 border-top text-white">
                                    <i className="fa-solid fa-credit-card text-primary mr-2"></i> Phương Thức Thanh Toán
                                </h5>

                                <div className="row g-3">
                                    <div className="col-md-6 mb-3">
                                        <div
                                            className={`payment-method-option d-flex align-items-center ${paymentMethod === 'COD' ? 'selected' : ''}`}
                                            onClick={() => setPaymentMethod('COD')}
                                        >
                                            <i className="fa-solid fa-money-bill-wave text-success fa-2x mr-3"></i>
                                            <div>
                                                <div className="font-weight-bold small">Thanh toán COD</div>
                                                <div className="text-muted small" style={{ fontSize: '11px' }}>Thanh toán khi nhận hàng</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <div
                                            className={`payment-method-option d-flex align-items-center ${paymentMethod === 'BANK' ? 'selected' : ''}`}
                                            onClick={() => setPaymentMethod('BANK')}
                                        >
                                            <i className="fa-solid fa-building-columns text-primary fa-2x mr-3"></i>
                                            <div>
                                                <div className="font-weight-bold small">Chuyển khoản</div>
                                                <div className="text-muted small" style={{ fontSize: '11px' }}>Chuyển khoản qua ngân hàng</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'BANK' && (
                                    <div className="alert alert-info border-0 rounded-lg p-3 small mt-3">
                                        <strong>🏦 Thông tin tài khoản ngân hàng:</strong>
                                        <br />Ngân hàng: Vietcombank (VCB)
                                        <br />Số tài khoản: 102311xxxx
                                        <br />Chủ tài khoản: LE TRONG BAO
                                        <br />Nội dung chuyển khoản: <strong className="text-danger">TT [Tên của bạn] - [Số điện thoại]</strong>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cột phải: Tóm tắt sản phẩm thanh toán */}
                        <div className="col-lg-5">
                            <div className="checkout-card p-4 p-md-5 sticky-top" style={{ top: '100px' }}>
                                <h5 className="font-weight-bold mb-4 text-white">
                                    <i className="fa-solid fa-basket-shopping text-primary mr-2"></i> Tóm Tắt Sản Phẩm
                                </h5>

                                <div className="checkout-items-list mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {cartItems.map((item) => (
                                        <div className="d-flex align-items-center checkout-item-row" key={item.id}>
                                            <img
                                                src={getImageUrl(item.imageUrl, fallbackImage)}
                                                alt={item.name}
                                                className="rounded-lg object-fit-cover mr-3"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = fallbackImage; }}
                                            />
                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                <div className="font-weight-bold text-white text-truncate small">{item.name}</div>
                                                <div className="text-muted small">
                                                    Số lượng: <strong className="text-white">{item.quantity}</strong>
                                                </div>
                                            </div>
                                            <div className="font-weight-bold text-white text-right pl-3 small">
                                                {formatVND(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-top pt-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Tạm tính ({totalItems} sản phẩm)</span>
                                        <span className="font-weight-bold text-white small">{formatVND(totalPrice)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Phí vận chuyển</span>
                                        <span className="text-success font-weight-bold small">Miễn phí</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted small">Giảm giá</span>
                                        <span className="font-weight-bold text-white small">0 ₫</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="font-weight-bold text-white">Tổng tiền thanh toán</span>
                                        <span className="font-weight-bold text-danger" style={{ fontSize: '1.4rem' }}>
                                            {formatVND(totalPrice)}
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block confirm-btn py-3 rounded-pill"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Đang xử lý đơn hàng...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-circle-check mr-2"></i> Xác Nhận Đặt Hàng
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Checkout;
