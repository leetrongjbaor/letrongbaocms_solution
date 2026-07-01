import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import customerService from '../../services/customerService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Vui lòng điền đầy đủ Email và Mật khẩu.');
            return;
        }

        setLoading(true);
        try {
            const res = await customerService.login(email, password);
            setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            
            // Lưu thông tin vào localStorage
            localStorage.setItem('customer', JSON.stringify(res.customer));
            
            // Chuyển hướng về trang chủ sau 1.5s
            setTimeout(() => {
                window.location.href = '/';
            }, 1200);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc kết nối.');
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
                        <div className="col-md-5 col-lg-4">
                            <div className="card border-0 shadow-lg p-4" style={{ borderRadius: '20px', background: '#fff' }}>
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#e50914' }}>
                                        <i className="fas fa-lock" style={{ fontSize: '24px' }}></i>
                                    </div>
                                    <h3 className="font-weight-bold text-dark mb-1">Đăng Nhập</h3>
                                    <p className="text-muted small">Chào mừng bạn trở lại với GadgetHub.Store</p>
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
                                        <label className="text-dark font-weight-bold small mb-1">Địa chỉ Email</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-light border-right-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </div>
                                            <input
                                                type="email"
                                                className="form-control bg-light border-left-0"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                style={{ borderRadius: '0 10px 10px 0', fontSize: '14px', height: '42px' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="text-dark font-weight-bold small mb-1">Mật khẩu</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-light border-right-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                                                    <i className="fas fa-key"></i>
                                                </span>
                                            </div>
                                            <input
                                                type="password"
                                                className="form-control bg-light border-left-0"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{ borderRadius: '0 10px 10px 0', fontSize: '14px', height: '42px' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 font-weight-bold shadow-sm"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#e50914',
                                            borderColor: '#e50914',
                                            borderRadius: '10px',
                                            height: '45px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {loading ? (
                                            <span>
                                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang xử lý...
                                            </span>
                                        ) : (
                                            'ĐĂNG NHẬP'
                                        )}
                                    </button>
                                </form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <p className="text-muted small mb-0">
                                        Bạn chưa có tài khoản?{' '}
                                        <Link to="/register" className="font-weight-bold text-primary text-decoration-none">
                                            Đăng ký ngay
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

export default Login;
