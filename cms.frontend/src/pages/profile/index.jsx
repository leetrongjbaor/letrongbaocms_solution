import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import customerService from '../../services/customerService';

function Profile() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            navigate('/login');
            return;
        }

        const parsed = JSON.parse(storedCustomer);
        setCustomer(parsed);
        setFullName(parsed.fullName || '');
        setPhone(parsed.phone || '');
        setAddress(parsed.address || '');
    }, [navigate]);

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!fullName.trim()) {
            setError('Họ và tên không được để trống.');
            return;
        }

        setLoading(true);
        try {
            const res = await customerService.updateProfile(customer.id, {
                fullName: fullName.trim(),
                phone: phone.trim() || null,
                address: address.trim() || null,
            });

            const updatedCustomer = res.customer;
            localStorage.setItem('customer', JSON.stringify(updatedCustomer));
            setCustomer(updatedCustomer);
            setSuccess('Cập nhật hồ sơ thành công.');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
        setFullName(customer.fullName || '');
        setPhone(customer.phone || '');
        setAddress(customer.address || '');
    };

    const handleLogout = () => {
        localStorage.removeItem('customer');
        window.location.href = '/';
    };

    if (!customer) return null;

    const firstLetter = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U';

    return (
        <div className="profile-page min-vh-100">
            <Header />
            <main className="profile-page__main">
                <div className="container">
                    <section className="profile-hero-new">
                        <div className="profile-avatar-new">{firstLetter}</div>
                        <div>
                            <p className="profile-eyebrow">Tài khoản cá nhân</p>
                            <h1>{customer.fullName}</h1>
                            <p><i className="fas fa-envelope"></i> {customer.email}</p>
                        </div>
                    </section>

                    {(success || error) && (
                        <div className={`profile-alert ${success ? 'success' : 'danger'}`}>
                            <i className={`fas ${success ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                            {success || error}
                        </div>
                    )}

                    <div className="profile-layout">
                        <section className="profile-panel">
                            <div className="profile-panel__head">
                                <div>
                                    <p>Thông tin hồ sơ</p>
                                    <h2>Chi tiết liên hệ</h2>
                                </div>
                                {!isEditing && (
                                    <button type="button" className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                                        <i className="fas fa-pen"></i> Sửa
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form className="profile-form" onSubmit={handleSave}>
                                    <label>
                                        <span>Họ và tên</span>
                                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                    </label>
                                    <label>
                                        <span>Email</span>
                                        <input value={customer.email} disabled />
                                    </label>
                                    <label>
                                        <span>Số điện thoại</span>
                                        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </label>
                                    <label>
                                        <span>Địa chỉ giao hàng</span>
                                        <input value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </label>
                                    <div className="profile-form__actions">
                                        <button type="submit" className="profile-save-btn" disabled={loading}>
                                            <i className="fas fa-save"></i> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                        <button type="button" className="profile-cancel-btn" onClick={handleCancelEdit}>
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <i className="fas fa-user"></i>
                                        <span>Họ và tên</span>
                                        <strong>{customer.fullName}</strong>
                                    </div>
                                    <div className="profile-info-item">
                                        <i className="fas fa-envelope"></i>
                                        <span>Email</span>
                                        <strong>{customer.email}</strong>
                                    </div>
                                    <div className="profile-info-item">
                                        <i className="fas fa-phone-alt"></i>
                                        <span>Số điện thoại</span>
                                        <strong>{customer.phone || 'Chưa cập nhật'}</strong>
                                    </div>
                                    <div className="profile-info-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>Địa chỉ</span>
                                        <strong>{customer.address || 'Chưa cập nhật'}</strong>
                                    </div>
                                </div>
                            )}
                        </section>

                        <aside className="profile-actions">
                            <Link to="/order-history">
                                <i className="fas fa-receipt"></i>
                                <span>
                                    <strong>Lịch sử đơn hàng</strong>
                                    <small>Xem các đơn đã đặt</small>
                                </span>
                            </Link>
                            <Link to="/cart">
                                <i className="fas fa-shopping-bag"></i>
                                <span>
                                    <strong>Giỏ hàng</strong>
                                    <small>Kiểm tra sản phẩm đang chọn</small>
                                </span>
                            </Link>
                            <Link to="/shop">
                                <i className="fas fa-store"></i>
                                <span>
                                    <strong>Tiếp tục mua sắm</strong>
                                    <small>Khám phá sản phẩm mới</small>
                                </span>
                            </Link>
                            <button type="button" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>
                                    <strong>Đăng xuất</strong>
                                    <small>Thoát khỏi tài khoản</small>
                                </span>
                            </button>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Profile;
