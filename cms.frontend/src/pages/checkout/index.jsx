import React from 'react';

function Checkout() {
    return (
        <div className="container text-center py-5 my-5">
            <div className="p-5 bg-white shadow-sm border" style={{ borderRadius: '15px' }}>
                <i className="far fa-credit-card text-success mb-4" style={{ fontSize: '48px' }}></i>
                <h3 className="font-weight-bold text-dark mb-2">Thanh Toán Đơn Hàng</h3>
                <p className="text-muted mb-0">Đang phát triển... Hệ thống thanh toán đang được lập trình kết nối API Orders.</p>
            </div>
        </div>
    );
}

export default Checkout;
