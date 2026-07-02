import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CartComponent from '../../components/Cart';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Tải giỏ hàng từ localStorage khi mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Lỗi khi tải giỏ hàng:", e);
            }
        }
    }, []);

    const handleBack = () => {
        navigate('/shop');
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                const stockQuantity = Number(item.stockQuantity || 0);
                const nextQuantity = Math.max(1, Number(newQuantity) || 1);

                if (stockQuantity > 0 && nextQuantity > stockQuantity) {
                    alert(`Không thể mua thêm "${item.name}". Trong kho chỉ còn ${stockQuantity} sản phẩm.`);
                    return { ...item, quantity: stockQuantity };
                }

                return { ...item, quantity: nextQuantity };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleClearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <CartComponent
                        cartItems={cartItems}
                        onBack={handleBack}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onClearCart={handleClearCart}
                        onCheckout={() => navigate('/checkout')}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;
