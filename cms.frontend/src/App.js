import React, { useState, useEffect } from 'react';
import CategoryProductList from './components/CategoryProductList';
import BlogCategoryList from './components/BlogCategoryList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import PostDetail from './components/PostDetail';
import './App.css';

function App() {
    // Tab đang hoạt động: 'products' (Sản phẩm) hoặc 'posts' (Bài viết)
    const [activeTab, setActiveTab] = useState('products');

    // Điều hướng trang: 'home' | 'product-detail' | 'post-detail'
    const [currentView, setCurrentView] = useState('home');
    const [selectedDetailId, setSelectedDetailId] = useState(null);

    // Lưu ID danh mục được chọn để lọc
    const [selectedProductCategory, setSelectedProductCategory] = useState(null);
    const [selectedBlogCategory, setSelectedBlogCategory] = useState(null);

    // Số lượng sản phẩm trong giỏ hàng (mock)
    const [cartCount, setCartCount] = useState(0);

    // Tự động reset danh mục khi chuyển Tab
    useEffect(() => {
        // Quay lại trang danh sách chính khi đổi tab
        setCurrentView('home');
        setSelectedDetailId(null);

        if (activeTab === 'products') {
            setSelectedBlogCategory(null);
        } else {
            setSelectedProductCategory(null);
        }
    }, [activeTab]);

    // Điều hướng xem chi tiết sản phẩm
    const handleViewProductDetail = (id) => {
        setSelectedDetailId(id);
        setCurrentView('product-detail');
    };

    // Điều hướng xem chi tiết bài viết
    const handleViewPostDetail = (id) => {
        setSelectedDetailId(id);
        setCurrentView('post-detail');
    };

    // Xử lý thêm vào giỏ hàng từ trang chi tiết
    const handleAddToCart = (product) => {
        setCartCount(prev => prev + 1);
        alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <style>{`
                /* Tab navigation */
                .custom-tab-btn {
                    font-weight: 600;
                    font-size: 1.1rem;
                    padding: 14px 28px;
                    border: none;
                    background: transparent;
                    color: #6c757d;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                    outline: none !important;
                }
                .custom-tab-btn:hover {
                    color: #212529;
                }
                .custom-tab-btn.active-blue {
                    color: #0d6efd;
                    border-bottom-color: #0d6efd;
                }
                .custom-tab-btn.active-cyan {
                    color: #0dcaf0;
                    border-bottom-color: #0dcaf0;
                }

                /* Hero Section */
                .hero-section {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: #fff;
                    padding: 80px 0;
                    border-radius: 0 0 40px 40px;
                    margin-bottom: 40px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                }
                .hero-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(13,110,253,0.15) 0%, rgba(0,0,0,0) 70%);
                    pointer-events: none;
                }
                .hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                    line-height: 1.2;
                }
                .hero-subtitle {
                    font-size: 1.15rem;
                    color: #94a3b8;
                    font-weight: 400;
                    max-width: 600px;
                }
            `}</style>

            {/* Header / Navbar (Luôn hiển thị ở đầu trang) */}
            <Header 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setCurrentView('home');
                }} 
                cartCount={cartCount} 
                onCartClick={() => alert('Chức năng giỏ hàng đang được phát triển!')} 
            />

            {/* Banner giới thiệu thương hiệu (Chỉ xuất hiện ở trang chủ chính) */}
            {currentView === 'home' && (
                <div className="hero-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8 text-center text-lg-start">
                                <span className="badge bg-primary px-3 py-2 rounded-pill font-weight-bold text-uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Bộ sưu tập Xuân Hè 2026
                                </span>
                                <h1 className="hero-title mb-3">
                                    Định Hình Phong Cách<br />Thời Trang Mới
                                </h1>
                                <p className="hero-subtitle mb-4">
                                    Khám phá các mẫu đầm thời thượng, phụ kiện thiết kế tinh tế và những bài viết chia sẻ bí quyết làm đẹp từ các chuyên gia thời trang hàng đầu.
                                </p>
                                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start" style={{ gap: '15px' }}>
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className="btn btn-primary btn-lg rounded-pill px-4 py-3 font-weight-bold"
                                        style={{ fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(13,110,253,0.3)' }}
                                    >
                                        Mua sắm ngay <i className="fa-solid fa-bag-shopping ms-2"></i>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('posts')}
                                        className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 font-weight-bold"
                                        style={{ fontSize: '0.95rem' }}
                                    >
                                        Đọc bài viết mới nhất <i className="fa-solid fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-4 d-none d-lg-block text-end">
                                <i className="fa-solid fa-wand-magic-sparkles text-primary" style={{ fontSize: '8rem', opacity: 0.15 }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nội dung trang thay đổi linh hoạt theo currentView */}
            <div className="container mb-5 flex-grow-1">
                {currentView === 'product-detail' && (
                    <ProductDetail 
                        productId={selectedDetailId} 
                        onBack={() => setCurrentView('home')} 
                        onAddToCart={handleAddToCart}
                    />
                )}

                {currentView === 'post-detail' && (
                    <PostDetail 
                        postId={selectedDetailId} 
                        onBack={() => setCurrentView('home')} 
                    />
                )}

                {currentView === 'home' && (
                    <>
                        {/* Tabs Switcher */}
                        <div className="bg-white rounded shadow-sm border-0 d-flex justify-content-center mb-4 p-2" style={{ borderRadius: '16px' }}>
                            <button
                                className={`custom-tab-btn px-4 py-3 mx-2 ${activeTab === 'products' ? 'active-blue' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <i className="fa-solid fa-bag-shopping me-2"></i> Sản Phẩm Cửa Hàng
                            </button>
                            <button
                                className={`custom-tab-btn px-4 py-3 mx-2 ${activeTab === 'posts' ? 'active-cyan' : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                <i className="fa-solid fa-newspaper me-2"></i> Xu Hướng & Tin Tức
                            </button>
                        </div>

                        {/* Layout Chia Cột */}
                        <div className="row">
                            {/* Cột trái: Thanh bên lọc danh mục */}
                            <div className="col-lg-3 col-md-4 mb-4">
                                {activeTab === 'products' ? (
                                    <CategoryProductList
                                        activeId={selectedProductCategory}
                                        onSelectCategory={setSelectedProductCategory}
                                    />
                                ) : (
                                    <BlogCategoryList
                                        activeId={selectedBlogCategory}
                                        onSelectCategory={setSelectedBlogCategory}
                                    />
                                )}
                            </div>

                            {/* Cột phải: Lưới danh sách sản phẩm hoặc bài viết */}
                            <div className="col-lg-9 col-md-8">
                                <div className="bg-white p-4 rounded shadow-sm" style={{ borderRadius: '16px', minHeight: '400px' }}>
                                    {activeTab === 'products' ? (
                                        <div>
                                            <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                                                <h4 className="mb-0 font-weight-bold text-dark">
                                                    <i className="fa-solid fa-store text-primary me-2"></i> Danh sách sản phẩm
                                                </h4>
                                            </div>
                                            <ProductList
                                                selectedCategoryId={selectedProductCategory}
                                                onViewDetail={handleViewProductDetail}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                                                <h4 className="mb-0 font-weight-bold text-dark">
                                                    <i className="fa-solid fa-newspaper text-info me-2"></i> Xu hướng thời trang
                                                </h4>
                                            </div>
                                            <PostList
                                                selectedCategoryId={selectedBlogCategory}
                                                onViewDetail={handleViewPostDetail}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer (Luôn hiển thị ở chân trang) */}
            <Footer />
            )}
        </div>
    );
}

export default App;