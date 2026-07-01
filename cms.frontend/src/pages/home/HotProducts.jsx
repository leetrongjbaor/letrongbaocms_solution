import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/imageHelper';
import { addToCart } from '../../utils/cartHelper';

function HotProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHotProducts = async () => {
            try {
                setLoading(true);
                let data = [];

                try {
                    data = await productService.getBestSellingProducts();
                } catch {
                    data = await productService.getAllProducts();
                }

                const topProducts = [...(data || [])]
                    .sort((a, b) => {
                        const soldA = a.soldQuantity || a.totalSold || a.soldCount || 0;
                        const soldB = b.soldQuantity || b.totalSold || b.soldCount || 0;
                        if (soldB !== soldA) return soldB - soldA;
                        return (b.id || 0) - (a.id || 0);
                    })
                    .slice(0, 3);

                setProducts(topProducts);
            } catch (error) {
                console.error('Không thể tải sản phẩm bán chạy:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadHotProducts();
    }, []);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value || 0);

    if (loading) {
        return (
            <section className="hot-products-section">
                <div className="container">
                    <div className="hot-products-loading">
                        <span></span>
                        <p>Đang tải sản phẩm bán chạy...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="hot-products-section">
            <div className="container">
                <div className="hot-products-head">
                    <div>
                        <p>Sản phẩm Hot</p>
                        <h2>Bán chạy nhất</h2>
                    </div>
                    <Link to="/shop">
                        Xem tất cả <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="hot-products-grid">
                    {products.map((product, index) => {
                        const soldQuantity = product.soldQuantity || product.totalSold || product.soldCount || 0;
                        const imageUrl = getImageUrl(
                            product.imageUrl,
                            'https://placehold.co/520x420/111111/e50914?text=Hot+Product'
                        );

                        return (
                            <article className="hot-product-card" key={product.id}>
                                <div className="hot-product-rank">#{index + 1}</div>
                                <div className="hot-product-image">
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        onError={(event) => {
                                            event.currentTarget.src = 'https://placehold.co/520x420/111111/e50914?text=Hot+Product';
                                        }}
                                    />
                                </div>
                                <div className="hot-product-body">
                                    <span>{product.categoryName || 'Gaming gear'}</span>
                                    <h3>{product.name}</h3>
                                    <div className="hot-product-meta">
                                        <strong>{formatCurrency(product.price)}</strong>
                                        <small>
                                            <i className="fas fa-fire"></i>
                                            {soldQuantity > 0 ? `Đã bán ${soldQuantity}` : 'Đang nổi bật'}
                                        </small>
                                    </div>
                                    <div className="hot-product-actions">
                                        <Link to={`/product/${product.id}`}>
                                            <i className="fas fa-eye"></i> Chi tiết
                                        </Link>
                                        <button type="button" onClick={() => addToCart(product)}>
                                            <i className="fas fa-cart-plus"></i> Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HotProducts;
