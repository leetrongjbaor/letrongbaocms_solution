import React from 'react';

const Header = ({ activeTab, onTabChange, cartCount, onCartClick }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom py-3 sticky-top shadow-sm">
            <style>{`
                .navbar-brand-style {
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    background: linear-gradient(45deg, #0d6efd, #0dcaf0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .nav-link-custom {
                    font-weight: 500;
                    color: #495057;
                    transition: color 0.2s ease;
                }
                .nav-link-custom:hover {
                    color: #0d6efd;
                    text-decoration: none;
                }
            `}</style>
            <div className="container">
                <span 
                    className="navbar-brand font-weight-bold navbar-brand-style d-flex align-items-center" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => onTabChange('products')}
                >
                    👗 Fashion Boutique
                </span>
                
                <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
                    <ul className="navbar-nav ml-auto align-items-center">
                        <li className="nav-item px-3">
                            <span 
                                className="nav-link nav-link-custom cursor-pointer" 
                                style={{ 
                                    cursor: 'pointer', 
                                    color: activeTab === 'products' ? '#0d6efd' : '#495057',
                                    fontWeight: activeTab === 'products' ? '700' : '500'
                                }} 
                                onClick={() => onTabChange('products')}
                            >
                                Cửa hàng
                            </span>
                        </li>
                        <li className="nav-item px-3">
                            <span 
                                className="nav-link nav-link-custom cursor-pointer" 
                                style={{ 
                                    cursor: 'pointer', 
                                    color: activeTab === 'posts' ? '#0dcaf0' : '#495057',
                                    fontWeight: activeTab === 'posts' ? '700' : '500'
                                }} 
                                onClick={() => onTabChange('posts')}
                            >
                                Tin tức thời trang
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center ml-auto ml-lg-3">
                    <button 
                        className="btn btn-light rounded-pill px-4 py-2 border-0 d-flex align-items-center" 
                        onClick={onCartClick}
                    >
                        <i className="fa-solid fa-cart-shopping text-primary mr-2" style={{ fontSize: '1.1rem' }}></i>
                        <span className="font-weight-bold" style={{ color: '#475569' }}>Giỏ hàng</span>
                        <span className="badge badge-primary ml-2 rounded-circle" style={{ fontSize: '0.85rem', padding: '5px 8px' }}>
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
