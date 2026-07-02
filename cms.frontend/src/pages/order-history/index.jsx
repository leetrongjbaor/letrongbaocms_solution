import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../utils/imageHelper';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop';

function OrderHistory() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const formatVND = (amount = 0) => (
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa có ngày';
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = (status) => {
        switch (Number(status)) {
            case 0:
                return { label: 'Chờ xử lý', icon: 'fa-clock', className: 'status-pending' };
            case 1:
                return { label: 'Đang giao', icon: 'fa-truck', className: 'status-shipping' };
            case 2:
                return { label: 'Hoàn thành', icon: 'fa-check-circle', className: 'status-done' };
            default:
                return { label: 'Không xác định', icon: 'fa-question-circle', className: 'status-unknown' };
        }
    };

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            alert('Vui lòng đăng nhập để xem lịch sử đơn hàng!');
            navigate('/login');
            return;
        }

        try {
            const parsedCustomer = JSON.parse(storedCustomer);
            setCustomer(parsedCustomer);

            const fetchOrders = async () => {
                try {
                    setLoading(true);
                    const data = await orderService.getOrdersByCustomer(parsedCustomer.id);
                    setOrders(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Lỗi tải lịch sử đơn hàng:', error);
                    setOrders([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        } catch {
            localStorage.removeItem('customer');
            navigate('/login');
        }
    }, [navigate]);

    const stats = useMemo(() => ({
        total: orders.length,
        completed: orders.filter((order) => Number(order.status) === 2).length,
        pending: orders.filter((order) => Number(order.status) === 0).length,
        spending: orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
    }), [orders]);

    const toggleExpand = (orderId) => {
        setExpandedOrder((current) => (current === orderId ? null : orderId));
    };

    if (!customer) return null;

    return (
        <div className="order-history-page d-flex flex-column min-vh-100">
            <Header />

            <main className="order-history-main flex-grow-1">
                <style>{`
                    .order-history-page {
                        background:
                            radial-gradient(circle at 8% 0%, rgba(229, 9, 20, 0.18), transparent 30%),
                            linear-gradient(180deg, #080808 0%, #121212 46%, #080808 100%);
                        color: #f5f5f5;
                    }
                    .order-history-main {
                        padding: 42px 0 56px;
                    }
                    .oh-shell {
                        max-width: 1120px;
                    }
                    .oh-hero {
                        position: relative;
                        overflow: hidden;
                        border-radius: 18px;
                        padding: 30px;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        background:
                            linear-gradient(135deg, rgba(229, 9, 20, 0.95), rgba(80, 0, 5, 0.9) 46%, rgba(17, 17, 17, 0.95));
                        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
                    }
                    .oh-hero::after {
                        content: '';
                        position: absolute;
                        width: 360px;
                        height: 360px;
                        right: -120px;
                        top: -170px;
                        border-radius: 999px;
                        background: rgba(255, 255, 255, 0.12);
                    }
                    .oh-hero-content {
                        position: relative;
                        z-index: 1;
                    }
                    .oh-eyebrow {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 10px;
                        color: rgba(255, 255, 255, 0.74);
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                    .oh-title {
                        margin: 0;
                        color: #fff;
                        font-size: clamp(30px, 4vw, 48px);
                        font-weight: 900;
                        line-height: 1.05;
                    }
                    .oh-subtitle {
                        max-width: 560px;
                        margin: 12px 0 0;
                        color: rgba(255, 255, 255, 0.72);
                        line-height: 1.65;
                    }
                    .oh-stats {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 12px;
                        margin-top: 22px;
                    }
                    .oh-stat {
                        min-height: 92px;
                        padding: 16px;
                        border-radius: 14px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        backdrop-filter: blur(10px);
                    }
                    .oh-stat span {
                        display: block;
                        color: rgba(255, 255, 255, 0.62);
                        font-size: 12px;
                        font-weight: 800;
                        text-transform: uppercase;
                    }
                    .oh-stat strong {
                        display: block;
                        margin-top: 8px;
                        color: #fff;
                        font-size: 24px;
                        font-weight: 900;
                        line-height: 1.1;
                    }
                    .oh-toolbar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                        margin: 22px 0 18px;
                    }
                    .oh-breadcrumb {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #a8a8a8;
                        font-size: 14px;
                    }
                    .oh-breadcrumb a {
                        color: #fff;
                        font-weight: 800;
                        text-decoration: none;
                    }
                    .oh-breadcrumb a:hover {
                        color: #ff2d38;
                    }
                    .oh-back {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        min-height: 40px;
                        padding: 0 14px;
                        border-radius: 10px;
                        background: rgba(255, 255, 255, 0.06);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: #fff;
                        font-weight: 800;
                        text-decoration: none;
                    }
                    .oh-back:hover {
                        color: #fff;
                        background: rgba(229, 9, 20, 0.22);
                    }
                    .oh-list {
                        display: grid;
                        gap: 14px;
                    }
                    .order-card {
                        overflow: hidden;
                        border-radius: 16px;
                        background: #151515;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
                    }
                    .order-header {
                        width: 100%;
                        border: 0;
                        background: transparent;
                        color: inherit;
                        padding: 20px;
                        text-align: left;
                        cursor: pointer;
                    }
                    .order-header:hover {
                        background: rgba(255, 255, 255, 0.03);
                    }
                    .order-topline {
                        display: grid;
                        grid-template-columns: 1fr auto;
                        gap: 18px;
                        align-items: center;
                    }
                    .order-meta {
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    .order-id {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        min-height: 34px;
                        padding: 0 12px;
                        border-radius: 10px;
                        background: #e50914;
                        color: #fff;
                        font-size: 13px;
                        font-weight: 900;
                    }
                    .status-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 7px;
                        min-height: 34px;
                        padding: 0 12px;
                        border-radius: 999px;
                        font-size: 13px;
                        font-weight: 900;
                    }
                    .status-pending {
                        color: #fbbf24;
                        background: rgba(251, 191, 36, 0.12);
                    }
                    .status-shipping {
                        color: #60a5fa;
                        background: rgba(96, 165, 250, 0.12);
                    }
                    .status-done {
                        color: #ff5963;
                        background: rgba(229, 9, 20, 0.14);
                    }
                    .status-unknown {
                        color: #d4d4d4;
                        background: rgba(255, 255, 255, 0.08);
                    }
                    .order-date {
                        color: #a8a8a8;
                        font-size: 13px;
                        font-weight: 700;
                    }
                    .order-total {
                        display: flex;
                        align-items: center;
                        gap: 18px;
                    }
                    .order-total-text {
                        text-align: right;
                    }
                    .order-total-text strong {
                        display: block;
                        color: #fff;
                        font-size: 18px;
                        font-weight: 900;
                    }
                    .order-total-text span {
                        display: block;
                        margin-top: 4px;
                        color: #a8a8a8;
                        font-size: 13px;
                        font-weight: 700;
                    }
                    .order-chevron {
                        width: 36px;
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.06);
                        color: #fff;
                        transition: transform 0.2s ease, background 0.2s ease;
                    }
                    .order-chevron.open {
                        transform: rotate(180deg);
                        background: rgba(229, 9, 20, 0.25);
                    }
                    .order-details {
                        padding: 0 20px 20px;
                    }
                    .order-details-inner {
                        border-top: 1px solid rgba(255, 255, 255, 0.08);
                        padding-top: 18px;
                    }
                    .details-title {
                        margin: 0 0 12px;
                        color: #fff;
                        font-size: 15px;
                        font-weight: 900;
                    }
                    .order-item {
                        display: grid;
                        grid-template-columns: 64px minmax(0, 1fr) auto;
                        gap: 14px;
                        align-items: center;
                        padding: 14px;
                        border-radius: 14px;
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                    }
                    .order-item + .order-item {
                        margin-top: 10px;
                    }
                    .order-item img {
                        width: 64px;
                        height: 64px;
                        border-radius: 12px;
                        object-fit: cover;
                        background: #242424;
                    }
                    .order-item-name {
                        color: #fff;
                        font-weight: 900;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .order-item-sub {
                        margin-top: 5px;
                        color: #a8a8a8;
                        font-size: 13px;
                        font-weight: 700;
                    }
                    .order-item-price {
                        color: #ff2d38;
                        font-weight: 900;
                        text-align: right;
                        white-space: nowrap;
                    }
                    .order-note {
                        margin-top: 12px;
                        padding: 12px 14px;
                        border-radius: 12px;
                        color: #d8d8d8;
                        background: rgba(229, 9, 20, 0.1);
                        border: 1px solid rgba(229, 9, 20, 0.16);
                        font-size: 13px;
                    }
                    .order-summary {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 14px;
                        margin-top: 16px;
                        padding-top: 16px;
                        border-top: 1px solid rgba(255, 255, 255, 0.08);
                    }
                    .order-summary span {
                        color: #d7d7d7;
                        font-weight: 800;
                    }
                    .order-summary strong {
                        color: #ff2d38;
                        font-size: 20px;
                        font-weight: 900;
                    }
                    .oh-empty,
                    .oh-loading {
                        min-height: 320px;
                        display: grid;
                        place-items: center;
                        text-align: center;
                        border-radius: 18px;
                        background: #151515;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                    }
                    .oh-empty-icon {
                        width: 104px;
                        height: 104px;
                        margin: 0 auto 18px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: rgba(229, 9, 20, 0.12);
                        color: #ff2d38;
                        font-size: 40px;
                    }
                    .oh-empty h3 {
                        color: #fff;
                        font-weight: 900;
                        margin-bottom: 8px;
                    }
                    .oh-empty p {
                        max-width: 440px;
                        margin: 0 auto 20px;
                        color: #a8a8a8;
                        line-height: 1.65;
                    }
                    .oh-shop-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        min-height: 46px;
                        padding: 0 18px;
                        border-radius: 12px;
                        background: linear-gradient(135deg, #e50914, #9f0710);
                        color: #fff;
                        font-weight: 900;
                        text-decoration: none;
                    }
                    .oh-shop-btn:hover {
                        color: #fff;
                        box-shadow: 0 12px 28px rgba(229, 9, 20, 0.28);
                    }
                    .oh-spinner {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        border: 4px solid rgba(255, 255, 255, 0.12);
                        border-top-color: #e50914;
                        animation: ohSpin 0.85s linear infinite;
                        margin: 0 auto 14px;
                    }
                    .oh-loading p {
                        color: #d7d7d7;
                        margin: 0;
                        font-weight: 800;
                    }
                    @keyframes ohSpin {
                        to { transform: rotate(360deg); }
                    }
                    @media (max-width: 768px) {
                        .order-history-main {
                            padding: 26px 0 42px;
                        }
                        .oh-hero {
                            padding: 24px 18px;
                        }
                        .oh-stats {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                        .oh-toolbar {
                            align-items: flex-start;
                            flex-direction: column;
                        }
                        .order-topline {
                            grid-template-columns: 1fr;
                        }
                        .order-total {
                            justify-content: space-between;
                        }
                        .order-total-text {
                            text-align: left;
                        }
                        .order-item {
                            grid-template-columns: 56px minmax(0, 1fr);
                        }
                        .order-item img {
                            width: 56px;
                            height: 56px;
                        }
                        .order-item-price {
                            grid-column: 1 / -1;
                            text-align: left;
                        }
                    }
                `}</style>

                <div className="container oh-shell">
                    <section className="oh-hero">
                        <div className="oh-hero-content">
                            <div className="oh-eyebrow">
                                <i className="fas fa-receipt"></i>
                                Tài khoản của bạn
                            </div>
                            <h1 className="oh-title">Lịch sử mua hàng</h1>
                            <p className="oh-subtitle">
                                Theo dõi trạng thái đơn hàng, kiểm tra sản phẩm đã mua và xem lại tổng tiền từng đơn.
                            </p>

                            <div className="oh-stats">
                                <div className="oh-stat">
                                    <span>Tổng đơn</span>
                                    <strong>{stats.total}</strong>
                                </div>
                                <div className="oh-stat">
                                    <span>Hoàn thành</span>
                                    <strong>{stats.completed}</strong>
                                </div>
                                <div className="oh-stat">
                                    <span>Đang chờ</span>
                                    <strong>{stats.pending}</strong>
                                </div>
                                <div className="oh-stat">
                                    <span>Tổng mua</span>
                                    <strong>{formatVND(stats.spending)}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="oh-toolbar">
                        <div className="oh-breadcrumb">
                            <Link to="/">Trang chủ</Link>
                            <i className="fas fa-chevron-right"></i>
                            <Link to="/profile">Tài khoản</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>Lịch sử mua hàng</span>
                        </div>
                        <Link to="/profile" className="oh-back">
                            <i className="fas fa-arrow-left"></i>
                            Hồ sơ cá nhân
                        </Link>
                    </div>

                    {loading && (
                        <div className="oh-loading">
                            <div>
                                <div className="oh-spinner"></div>
                                <p>Đang tải lịch sử đơn hàng...</p>
                            </div>
                        </div>
                    )}

                    {!loading && orders.length === 0 && (
                        <div className="oh-empty">
                            <div>
                                <div className="oh-empty-icon">
                                    <i className="fas fa-shopping-bag"></i>
                                </div>
                                <h3>Chưa có đơn hàng nào</h3>
                                <p>Bạn chưa đặt đơn hàng nào. Hãy khám phá cửa hàng và chọn sản phẩm yêu thích.</p>
                                <Link to="/shop" className="oh-shop-btn">
                                    <i className="fas fa-store"></i>
                                    Mua sắm ngay
                                </Link>
                            </div>
                        </div>
                    )}

                    {!loading && orders.length > 0 && (
                        <div className="oh-list">
                            {orders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                const isExpanded = expandedOrder === order.id;
                                const items = Array.isArray(order.items) ? order.items : [];

                                return (
                                    <article className="order-card" key={order.id}>
                                        <button type="button" className="order-header" onClick={() => toggleExpand(order.id)}>
                                            <div className="order-topline">
                                                <div className="order-meta">
                                                    <span className="order-id">
                                                        <i className="fas fa-hashtag"></i>
                                                        ĐH {order.id}
                                                    </span>
                                                    <span className={`status-badge ${statusInfo.className}`}>
                                                        <i className={`fas ${statusInfo.icon}`}></i>
                                                        {statusInfo.label}
                                                    </span>
                                                    <span className="order-date">
                                                        <i className="far fa-calendar-alt mr-1"></i>
                                                        {formatDate(order.orderDate)}
                                                    </span>
                                                </div>

                                                <div className="order-total">
                                                    <div className="order-total-text">
                                                        <strong>{formatVND(order.totalAmount)}</strong>
                                                        <span>{order.totalItems || 0} sản phẩm</span>
                                                    </div>
                                                    <span className={`order-chevron ${isExpanded ? 'open' : ''}`}>
                                                        <i className="fas fa-chevron-down"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="order-details">
                                                <div className="order-details-inner">
                                                    <h2 className="details-title">
                                                        <i className="fas fa-box-open mr-2" style={{ color: '#ff2d38' }}></i>
                                                        Chi tiết sản phẩm
                                                    </h2>

                                                    {items.length > 0 ? (
                                                        items.map((item) => {
                                                            const itemTotal = Number(item.subTotal ?? item.quantity * item.unitPrice ?? 0);
                                                            return (
                                                                <div className="order-item" key={item.id || item.productId}>
                                                                    <img
                                                                        src={getImageUrl(item.productImage, FALLBACK_IMAGE)}
                                                                        alt={item.productName || 'Sản phẩm'}
                                                                        onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }}
                                                                    />
                                                                    <div style={{ minWidth: 0 }}>
                                                                        <div className="order-item-name">
                                                                            {item.productName || `Sản phẩm #${item.productId}`}
                                                                        </div>
                                                                        <div className="order-item-sub">
                                                                            {formatVND(item.unitPrice)} x {item.quantity}
                                                                        </div>
                                                                    </div>
                                                                    <div className="order-item-price">{formatVND(itemTotal)}</div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="order-note">Không có dữ liệu chi tiết sản phẩm.</div>
                                                    )}

                                                    {order.notes && (
                                                        <div className="order-note">
                                                            <i className="fas fa-sticky-note mr-2"></i>
                                                            <strong>Ghi chú:</strong> {order.notes}
                                                        </div>
                                                    )}

                                                    <div className="order-summary">
                                                        <span>Tổng cộng</span>
                                                        <strong>{formatVND(order.totalAmount)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default OrderHistory;
