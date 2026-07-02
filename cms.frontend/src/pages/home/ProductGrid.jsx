import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
// IMPORT file thành phần component CON VÀO ĐỂ SỬ DỤNG
import ProductCard from '../../components/ProductCard';

function ProductGrid({ activeCategoryId, activeCategoryName }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionTitle = activeCategoryId
        ? `Sản phẩm ${activeCategoryName || 'theo danh mục'}`
        : 'Tất cả sản phẩm';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (activeCategoryId !== null && activeCategoryId !== undefined) {
                    // Gọi API lấy sản phẩm theo danh mục khi có activeCategoryId
                    data = await productService.getProductsByCategory(activeCategoryId);
                } else {
                    // Ngược lại, gọi API lấy tất cả sản phẩm
                    data = await productService.getAllProducts();
                }
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategoryId]);

    if (loading) {
        return (
            <div id="home-product-grid" className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang tải danh sách trang phục mới nhất...</p>
            </div>
        );
    }

    return (
        <section id="home-product-grid" className="product-grid-wrapper py-4">
            <div className="container">

                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#e50914' }}>
                        <i className="fas fa-sparkles mr-2 text-warning"></i> {sectionTitle}
                    </h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        Hiển thị ({products.length}) sản phẩm
                    </span>
                </div>

                {/* KHUNG LƯỚI GRID SYSTEM */}
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                                {/* CHÈN ĐÚNG file thành phần component CON TẠI ĐÂY VÀ TRUYỀN DỮ LIỆU ĐI */}
                                <ProductCard item={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fas fa-info-circle fa-2x mb-3 text-info"></i>
                            <p>Không có sản phẩm nào thuộc danh mục này.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}

export default ProductGrid;
