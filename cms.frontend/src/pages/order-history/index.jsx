import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import orderService from '../../services/orderService';

function OrderHistory() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 0:
                return { label: 'Chờ xử lý', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'fa-clock' };
            case 1:
                return { label: 'Đang giao', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: 'fa-truck' };
            case 2:
                return { label: 'Hoàn thành', color: '#ff2d38', bg: 'rgba(229,9,20,0.12)', icon: 'fa-check-circle' };
            default:
                return { label: 'Không xác định', color: '#b8b8b8', bg: 'rgba(148,163,184,0.1)', icon: 'fa-question-circle' };
        }
    };

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            alert('Vui lòng đăng nhập để xem lịch sử đơn hàng!');
            navigate('/login');
            return;
        }

        const parsed = JSON.parse(storedCustomer);
        setCustomer(parsed);

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderService.getOrdersByCustomer(parsed.id);
                setOrders(data);
            } catch (err) {
                console.error("Lỗi tải lịch sử đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (!customer) return null;

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <style>{`
                        .oh-hero {
                            background: linear-gradient(135deg, #e50914 0%, #9f0710 60%, #141414 100%);
                            border-radius: 24px;
                            padding: 40px;
                            color: #fff;
                            position: relative;
                            overflow: hidden;
                            margin-bottom: 32px;
                        }
                        .oh-hero::before {
                            content: '';
                            position: absolute;
                            top: -60%;
                            right: -15%;
                            width: 400px;
                            height: 400px;
                            border-radius: 50%;
                            background: radial-gradient(circle, rgba(229,9,20,0.2) 0%, transparent 70%);
                            pointer-events: none;
                        }
                        .order-card {
                            background: #ffffff;
                            border-radius: 20px;
                            border: 1px solid rgba(0,0,0,0.04);
                            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                            margin-bottom: 16px;
                            overflow: hidden;
                            transition: all 0.3s ease;
                        }
                        .order-card:hover {
                            box-shadow: 0 8px 30px rgba(0,0,0,0.07);
                        }
                        .order-header {
                            padding: 24px 28px;
                            cursor: pointer;
                            transition: background 0.2s ease;
                        }
                        .order-header:hover {
                            background: #fafbfc;
                        }
                        .order-id-badge {
                            background: linear-gradient(135deg, #e50914, #9f0710);
                            color: #fff;
                            font-weight: 700;
                            font-size: 13px;
                            padding: 6px 14px;
                            border-radius: 8px;
                            letter-spacing: 0.5px;
                        }
                        .status-badge {
                            font-weight: 700;
                            font-size: 12px;
                            padding: 6px 14px;
                            border-radius: 20px;
                            letter-spacing: 0.3px;
                        }
                        .order-detail-panel {
                            background: #f8fafc;
                            border-top: 1px solid #f1f5f9;
                            padding: 24px 28px;
                            animation: slideDown 0.3s ease;
                        }
                        .detail-item {
                            display: flex;
                            align-items: center;
                            padding: 14px 0;
                            border-bottom: 1px solid #e2e8f0;
                        }
                        .detail-item:last-child {
                            border-bottom: none;
                        }
                        .detail-img {
                            width: 56px;
                            height: 56px;
                            border-radius: 12px;
                            object-fit: cover;
                            background: #e2e8f0;
                            flex-shrink: 0;
                        }
                        .empty-state {
                            text-align: center;
                            padding: 80px 20px;
                        }
                        .empty-icon {
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, rgba(229,9,20,0.08), rgba(229,9,20,0.08));
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 48px;
                            color: #b8b8b8;
                            margin-bottom: 24px;
                        }
                        .summary-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .expand-icon {
                            transition: transform 0.3s ease;
                            color: #b8b8b8;
                            font-size: 14px;
                        }
                        .expand-icon.rotated {
                            transform: rotate(180deg);
                        }
                        .loading-skeleton {
                            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 20px;
                            height: 100px;
                            margin-bottom: 16px;
                        }
                        @keyframes shimmer {
                            0% { background-position: -200% 0; }
                            100% { background-position: 200% 0; }
                        }
                        @keyframes slideDown {
                            from { opacity: 0; max-height: 0; }
                            to { opacity: 1; max-height: 1000px; }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .animate-in {
                            animation: fadeInUp 0.5s ease forwards;
                        }
                        .stats-card {
                            background: rgba(255,255,255,0.12);
                            border-radius: 14px;
                            padding: 14px 20px;
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255,255,255,0.1);
                        }
                        .stats-value {
                            font-size: 24px;
                            font-weight: 800;
                            line-height: 1;
                        }
                        .stats-label {
                            font-size: 12px;
                            color: rgba(255,255,255,0.6);
                            margin-top: 4px;
                        }
                    `}</style>

                    {/* Hero Section */}
                    <div className="oh-hero animate-in">
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div>
                                <h2 className="font-weight-bold mb-2" style={{ letterSpacing: '-0.5px' }}>
                                    <i className="fas fa-receipt mr-3"></i>Lịch Sử Đơn Hàng
                                </h2>
                                <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                                    Theo dõi tất cả đơn hàng của bạn tại đây
                                </p>
                            </div>
                            <div className="d-flex mt-3 mt-md-0">
                                <div className="stats-card mr-3 text-center">
                                    <div className="stats-value">{orders.length}</div>
                                    <div className="stats-label">Tổng đơn</div>
                                </div>
                                <div className="stats-card mr-3 text-center">
                                    <div className="stats-value" style={{ color: '#ff2d38' }}>
                                        {orders.filter(o => o.status === 2).length}
                                    </div>
                                    <div className="stats-label">Hoàn thành</div>
                                </div>
                                <div className="stats-card text-center">
                                    <div className="stats-value" style={{ color: '#f59e0b' }}>
                                        {orders.filter(o => o.status === 0).length}
                                    </div>
                                    <div className="stats-label">Đang chờ</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="mb-4">
                        <ol className="breadcrumb bg-transparent p-0 mb-0 small">
                            <li className="breadcrumb-item"><Link to="/" className="text-primary">Trang Chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/profile" className="text-primary">Tài Khoản</Link></li>
                            <li className="breadcrumb-item active text-muted">Lịch Sử Đơn Hàng</li>
                        </ol>
                    </nav>

                    {/* Loading State */}
                    {loading && (
                        <>
                            <div className="loading-skeleton"></div>
                            <div className="loading-skeleton"></div>
                            <div className="loading-skeleton"></div>
                        </>
                    )}

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <div className="empty-state animate-in">
                            <div className="empty-icon">
                                <i className="fas fa-shopping-bag"></i>
                            </div>
                            <h4 className="font-weight-bold text-dark mb-2">Chưa có đơn hàng nào</h4>
                            <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                                Bạn chưa đặt đơn hàng nào. Hãy khám phá bộ sưu tập thời trang của chúng tôi ngay!
                            </p>
                            <Link
                                to="/shop"
                                className="btn btn-primary px-4 py-2 font-weight-bold"
                                style={{
                                    borderRadius: '12px',
                                    backgroundColor: '#e50914',
                                    borderColor: '#e50914',
                                    boxShadow: '0 6px 20px rgba(229,9,20,0.25)'
                                }}
                            >
                                <i className="fas fa-store mr-2"></i> Mua Sắm Ngay
                            </Link>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && orders.length > 0 && orders.map((order, index) => {
                        const statusInfo = getStatusInfo(order.status);
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <div
                                className="order-card animate-in"
                                key={order.id}
                                style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
                            >
                                <div className="order-header" onClick={() => toggleExpand(order.id)}>
                                    <div className="summary-row">
                                        <div className="d-flex align-items-center flex-wrap">
                                            <span className="order-id-badge mr-3">
                                                ĐH #{order.id}
                                            </span>
                                            <span
                                                className="status-badge mr-3"
                                                style={{ background: statusInfo.bg, color: statusInfo.color }}
                                            >
                                                <i className={`fas ${statusInfo.icon} mr-1`}></i>
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-muted small d-none d-md-inline">
                                                <i className="far fa-calendar-alt mr-1"></i>
                                                {formatDate(order.orderDate)}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="text-right mr-3 d-none d-md-block">
                                                <div className="font-weight-bold text-dark" style={{ fontSize: '16px' }}>
                                                    {formatVND(order.totalAmount)}
                                                </div>
                                                <div className="text-muted small">
                                                    {order.totalItems} sản phẩm
                                                </div>
                                            </div>
                                            <i className={`fas fa-chevron-down expand-icon ${isExpanded ? 'rotated' : ''}`}></i>
                                        </div>
                                    </div>
                                    {/* Mobile: show price and date */}
                                    <div className="d-md-none mt-2">
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted small">
                                                <i className="far fa-calendar-alt mr-1"></i>
                                                {formatDate(order.orderDate)}
                                            </span>
                                            <span className="font-weight-bold text-dark">
                                                {formatVND(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chi tiết đơn hàng mở rộng */}
                                {isExpanded && (
                                    <div className="order-detail-panel">
                                        <h6 className="font-weight-bold text-dark mb-3">
                                            <i className="fas fa-box-open mr-2" style={{ color: '#e50914' }}></i>
                                            Chi tiết sản phẩm
                                        </h6>

                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item) => (
                                                <div className="detail-item" key={item.id}>
                                                    <img
                                                        src={item.productImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop"}
                                                        alt={item.productName}
                                                        className="detail-img mr-3"
                                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop"; }}
                                                    />
                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="font-weight-bold text-dark text-truncate" style={{ fontSize: '14px' }}>
                                                            {item.productName || `Sản phẩm #${item.productId}`}
                                                        </div>
                                                        <div className="text-muted small">
                                                            Đơn giá: {formatVND(item.unitPrice)} × {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="font-weight-bold text-dark text-right pl-3" style={{ fontSize: '14px' }}>
                                                        {formatVND(item.subTotal)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted small mb-0">Không có dữ liệu chi tiết</p>
                                        )}

                                        {/* Tổng tiền */}
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '2px solid #e2e8f0' }}>
                                            <span className="font-weight-bold text-dark">Tổng cộng:</span>
                                            <span className="font-weight-bold" style={{ color: '#e50914', fontSize: '18px' }}>
                                                {formatVND(order.totalAmount)}
                                            </span>
                                        </div>

                                        {/* Ghi chú */}
                                        {order.notes && (
                                            <div className="mt-3 p-3 rounded" style={{ background: 'rgba(229,9,20,0.06)', borderRadius: '12px' }}>
                                                <small className="text-muted">
                                                    <i className="fas fa-sticky-note mr-1"></i>
                                                    <strong>Ghi chú:</strong> {order.notes}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Back to profile link */}
                    {!loading && (
                        <div className="text-center mt-4">
                            <Link to="/profile" className="text-primary font-weight-bold text-decoration-none" style={{ fontSize: '15px' }}>
                                <i className="fas fa-arrow-left mr-2"></i>Quay lại Hồ Sơ Cá Nhân
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default OrderHistory;
