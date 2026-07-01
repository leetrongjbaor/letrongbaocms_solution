import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container site-footer__grid">
                <div>
                    <h4>GadgetHub<span>.Store</span></h4>
                    <p>
                        Cửa hàng gaming gear và phụ kiện công nghệ với giao diện mới tông đen đỏ,
                        tập trung vào trải nghiệm mua sắm rõ ràng và hiện đại.
                    </p>
                </div>

                <div>
                    <h5>Liên kết</h5>
                    <Link to="/shop">Cửa hàng</Link>
                    <Link to="/blog">Tin tức</Link>
                    <Link to="/about">Giới thiệu</Link>
                    <Link to="/order-history">Đơn hàng</Link>
                </div>

                <div>
                    <h5>Chính sách</h5>
                    <a href="/policy/delivery">Giao hàng</a>
                    <a href="/policy/exchange">Đổi trả</a>
                    <a href="/policy/privacy">Bảo mật</a>
                </div>

                <div>
                    <h5>Liên hệ</h5>
                    <p><i className="fas fa-map-marker-alt"></i> TP. Hồ Chí Minh</p>
                    <p><i className="fas fa-phone-alt"></i> 090x.xxx.xxx</p>
                    <p><i className="fas fa-envelope"></i> support@letrongbaocms.retail</p>
                </div>
            </div>

            <div className="site-footer__bottom">
                <div className="container">
                    © {new Date().getFullYear()} GadgetHub.Store
                </div>
            </div>
        </footer>
    );
}

export default Footer;
