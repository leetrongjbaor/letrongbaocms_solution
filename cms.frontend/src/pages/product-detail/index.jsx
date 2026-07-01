import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductDetailComponent from '../../components/ProductDetail';
import { addToCart } from '../../utils/cartHelper';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/shop');
    };

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <ProductDetailComponent 
                        productId={id} 
                        onBack={handleBack} 
                        onAddToCart={handleAddToCart} 
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ProductDetail;
