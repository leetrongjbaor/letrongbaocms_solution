const getCartItems = () => {
    const storedCart = localStorage.getItem('cart');
    if (!storedCart) return [];

    try {
        return JSON.parse(storedCart) || [];
    } catch (error) {
        console.error('Loi doc gio hang tu localStorage:', error);
        return [];
    }
};

const saveCartItems = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
};

export const addToCart = (product, quantity = 1) => {
    const addQuantity = Math.max(1, Number(quantity) || 1);
    const stockQuantity = Number(product.stockQuantity ?? 0);

    if (stockQuantity <= 0 || addQuantity > stockQuantity) {
        alert('Số lượng sản phẩm trong kho không đủ!');
        return false;
    }

    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? Number(existingItem.quantity || 0) : 0;

    if (currentQuantity + addQuantity > stockQuantity) {
        alert('Số lượng sản phẩm trong kho không đủ!');
        return false;
    }

    if (existingItem) {
        existingItem.quantity = currentQuantity + addQuantity;
        existingItem.stockQuantity = stockQuantity;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            categoryName: product.categoryName || 'Thời trang',
            stockQuantity,
            quantity: addQuantity
        });
    }

    saveCartItems(cartItems);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    return true;
};

