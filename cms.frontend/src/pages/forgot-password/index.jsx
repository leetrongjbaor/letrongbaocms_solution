import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import customerService from '../../services/customerService';

function ForgotPassword() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getErrorMessage = (err) => err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Vui lòng nhập email.');
            return;
        }

        try {
            setLoading(true);
            const res = await customerService.forgotPassword(email.trim());
            setMessage(res.message || 'Nếu email tồn tại, hệ thống đã gửi mã xác nhận đặt lại mật khẩu.');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim() || !token.trim() || !newPassword) {
            setError('Vui lòng nhập đủ email, mã xác nhận và mật khẩu mới.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            setLoading(true);
            const res = await customerService.resetPassword(email.trim(), token.trim(), newPassword);
            setMessage(res.message || 'Đặt lại mật khẩu thành công.');
            setToken('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(getErrorMessage(err));
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
                        <div className="col-lg-5 col-md-7">
                            <div className="card border-0 shadow-lg p-4" style={{ borderRadius: 18 }}>
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{ width: 62, height: 62, background: '#e50914', color: '#fff' }}>
                                        <i className="fas fa-key" style={{ fontSize: 24 }}></i>
                                    </div>
                                    <h3 className="font-weight-bold mb-1">Quên mật khẩu</h3>
                                    <p className="text-muted small mb-0">Nhận mã xác nhận qua email để đặt mật khẩu mới.</p>
                                </div>

                                {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
                                {message && <div className="alert alert-success py-2 small text-center">{message}</div>}

                                <form onSubmit={handleRequestReset} className="mb-4">
                                    <label className="font-weight-bold small">Email tài khoản</label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                        />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-danger" disabled={loading}>
                                                Gửi yêu cầu
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <form onSubmit={handleResetPassword}>
                                    <div className="form-group">
                                        <label className="font-weight-bold small">Mã xác nhận</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            placeholder="Nhập mã 6 số trong email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="font-weight-bold small">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Ít nhất 6 ký tự"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="font-weight-bold small">Nhập lại mật khẩu</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-dark w-100 font-weight-bold" disabled={loading}>
                                        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-danger font-weight-bold text-decoration-none">
                                        Quay lại đăng nhập
                                    </Link>
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

export default ForgotPassword;
