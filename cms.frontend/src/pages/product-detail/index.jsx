import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductDetailComponent from '../../components/ProductDetail';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/shop');
    };

    const handleAddToCart = (product) => {
        const storedCart = localStorage.getItem('cart');
        let cartItems = [];
        if (storedCart) {
            try {
                cartItems = JSON.parse(storedCart);
            } catch (e) {
                console.error("Lỗi khi parse giỏ hàng:", e);
            }
        }

        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < (product.stockQuantity || 99)) {
                existingItem.quantity += 1;
                alert(`Đã tăng số lượng "${product.name}" trong giỏ hàng!`);
            } else {
                alert(`Xin lỗi, số lượng sản phẩm trong giỏ hàng đã đạt giới hạn tồn kho (${product.stockQuantity})!`);
                return;
            }
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                categoryName: product.categoryName || 'Thời trang',
                stockQuantity: product.stockQuantity,
                quantity: 1
            });
            alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated'));
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
