import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadResults = async () => {
            const query = keyword.trim();
            if (!query) {
                setProducts([]);
                return;
            }

            try {
                setLoading(true);
                const data = await productService.searchProducts(query);
                setProducts(data || []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadResults();
    }, [keyword]);

    return (
        <div className="search-page min-vh-100">
            <Header />
            <main className="search-page__main">
                <div className="container">
                    <section className="search-hero">
                        <p>Kết quả tìm kiếm</p>
                        <h1>{keyword ? `"${keyword}"` : 'Tìm kiếm sản phẩm'}</h1>
                        <span>{loading ? 'Đang tải dữ liệu...' : `${products.length} sản phẩm phù hợp`}</span>
                    </section>

                    {loading ? (
                        <div className="search-state">
                            <span></span>
                            <p>Đang tìm sản phẩm...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="row">
                            {products.map((product) => (
                                <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                                    <ProductCard item={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="search-empty">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                                alt="Không tìm thấy sản phẩm"
                                className="search-empty__image"
                            />
                            <h2>Không tìm thấy sản phẩm</h2>
                            <p>Không tìm thấy sản phẩm nào phù hợp với yêu cầu bạn.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SearchPage;
