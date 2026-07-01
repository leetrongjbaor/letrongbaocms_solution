import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { getImageUrl } from '../utils/imageHelper';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const updateCartCount = () => {
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) {
            setCartCount(0);
            return;
        }

        try {
            const items = JSON.parse(storedCart);
            setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
            try {
                setCustomer(JSON.parse(storedCustomer));
            } catch {
                setCustomer(null);
            }
        }

        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    useEffect(() => {
        const keyword = searchKeyword.trim();
        if (keyword.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const data = await productService.searchProducts(keyword);
                setSearchResults((data || []).slice(0, 5));
                setShowSearchResults(true);
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        setCustomer(null);
        window.location.href = '/';
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const keyword = searchKeyword.trim();
        if (!keyword) return;

        setShowSearchResults(false);
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/shop', label: 'Cửa hàng' },
        { path: '/blog', label: 'Tin tức' },
        { path: '/about', label: 'Giới thiệu' },
    ];

    return (
        <header className="site-header">
            <div className="site-header__top">
                <div className="container site-header__top-inner">
                    <span><i className="fas fa-phone-alt"></i> 0332523139</span>
                    <span><i className="fas fa-envelope"></i> support@letrongbaocms.retail</span>
                    <div className="site-header__account">
                        {customer ? (
                            <>
                                <Link to="/profile"><i className="fas fa-user-circle"></i> {customer.fullName}</Link>
                                <button type="button" onClick={handleLogout}>Đăng xuất</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><i className="fas fa-user"></i> Đăng nhập</Link>
                                <Link to="/register"><i className="fas fa-user-plus"></i> Đăng ký</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="site-header__main">
                <div className="container site-header__main-inner">
                    <Link to="/" className="site-logo">
                        GadgetHub<span>.Store</span>
                    </Link>

                    <form className="site-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm gaming gear..."
                            value={searchKeyword}
                            onChange={(event) => setSearchKeyword(event.target.value)}
                            onFocus={() => {
                                if (searchResults.length > 0) setShowSearchResults(true);
                            }}
                        />
                        <button type="submit" aria-label="Tìm kiếm">
                            <i className="fas fa-search"></i>
                        </button>

                        {showSearchResults && (
                            <div className="site-search-results">
                                {searchLoading ? (
                                    <div className="site-search-status">Đang tìm...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((item) => (
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="site-search-item"
                                                key={item.id}
                                                onClick={() => setShowSearchResults(false)}
                                            >
                                                <img
                                                    src={getImageUrl(item.imageUrl, 'https://placehold.co/80x80/111111/e50914?text=SP')}
                                                    alt={item.name}
                                                />
                                                <span>
                                                    <strong>{item.name}</strong>
                                                    <small>{item.categoryName || 'Sản phẩm'}</small>
                                                </span>
                                            </Link>
                                        ))}
                                        <button type="submit" className="site-search-more">
                                            Xem tất cả kết quả
                                        </button>
                                    </>
                                ) : (
                                    <div className="site-search-status">Không tìm thấy sản phẩm</div>
                                )}
                            </div>
                        )}
                    </form>

                    <Link to="/cart" className="site-cart" aria-label="Giỏ hàng">
                        <i className="fas fa-shopping-bag"></i>
                        <span>{cartCount}</span>
                    </Link>
                </div>
            </div>

            <nav className="site-nav">
                <div className="container site-nav__inner">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={isActive(item.path) ? 'active' : ''}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}

export default Header;
