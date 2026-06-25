import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import customerService from '../../services/customerService';

function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fullName || !email || !password) {
            setError('Họ tên, Email và Mật khẩu là bắt buộc.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        setLoading(true);
        try {
            const customerData = {
                fullName,
                email,
                phone: phone || null,
                address: address || null,
                password
            };

            await customerService.register(customerData);
            setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
            
            // Chuyển hướng sang trang đăng nhập sau 1.5s
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Đăng ký thất bại. Email có thể đã tồn tại hoặc có lỗi kết nối.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />

            <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card border-0 shadow-lg p-4" style={{ borderRadius: '20px', background: '#fff' }}>
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#005088' }}>
                                        <i className="fas fa-user-plus" style={{ fontSize: '24px' }}></i>
                                    </div>
                                    <h3 className="font-weight-bold text-dark mb-1">Đăng Ký Tài Khoản</h3>
                                    <p className="text-muted small">Tạo tài khoản mua sắm tại GadgetHub.Store</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger py-2 px-3 small border-0 text-center mb-3" style={{ borderRadius: '8px' }}>
                                        <i className="fas fa-exclamation-circle mr-1"></i> {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success py-2 px-3 small border-0 text-center mb-3" style={{ borderRadius: '8px' }}>
                                        <i className="fas fa-check-circle mr-1"></i> {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label className="text-dark font-weight-bold small mb-1">Họ và tên *</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            placeholder="Nguyễn Văn A"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="text-dark font-weight-bold small mb-1">Địa chỉ Email *</label>
                                        <input
                                            type="email"
                                            className="form-control bg-light"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="text-dark font-weight-bold small mb-1">Số điện thoại</label>
                                                <input
                                                    type="tel"
                                                    className="form-control bg-light"
                                                    placeholder="0901234567"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="text-dark font-weight-bold small mb-1">Địa chỉ</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-light"
                                                    placeholder="Quận 1, TP.HCM"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="text-dark font-weight-bold small mb-1">Mật khẩu *</label>
                                                <input
                                                    type="password"
                                                    className="form-control bg-light"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="text-dark font-weight-bold small mb-1">Nhập lại mật khẩu *</label>
                                                <input
                                                    type="password"
                                                    className="form-control bg-light"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    style={{ borderRadius: '10px', fontSize: '14px', height: '40px' }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 font-weight-bold shadow-sm mt-3"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#005088',
                                            borderColor: '#005088',
                                            borderRadius: '10px',
                                            height: '45px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {loading ? (
                                            <span>
                                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang đăng ký...
                                            </span>
                                        ) : (
                                            'ĐĂNG KÝ NGAY'
                                        )}
                                    </button>
                                </form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <p className="text-muted small mb-0">
                                        Bạn đã có tài khoản?{' '}
                                        <Link to="/login" className="font-weight-bold text-primary text-decoration-none">
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Register;
