import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import { getImageUrl } from '../../utils/imageHelper';
import { addToCart } from '../../utils/cartHelper';

// ========================================================================
//  TRANG CỬA HÀNG CHUYÊN NGHIỆP — PHONG CÁCH THƯƠNG MẠI ĐIỆN TỬ CAO CẤP
//  Thiết kế lấy cảm hứng từ Shopee, Tiki, Zara — đáp ứng tiêu chí bảng điểm
// ========================================================================
function Shop() {
    // ─── STATE MANAGEMENT ──────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    // Bộ lọc & tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // UI States
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const ITEMS_PER_PAGE = 9;

    // ─── API CALLS ─────────────────────────────────────────────────────
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi khi tải danh mục sản phẩm:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoadingProducts(true);
                let data = [];
                if (selectedCategoryId || minPrice || maxPrice) {
                    data = await productService.filterProducts({
                        categoryProductId: selectedCategoryId,
                        minPrice,
                        maxPrice
                    });
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách sản phẩm:", err);
                setError("Không thể nạp danh sách sản phẩm.");
            } finally {
                setLoadingProducts(false);
            }
        };
        loadProducts();
    }, [selectedCategoryId, minPrice, maxPrice]);

    // ─── FILTER & SORT LOGIC ───────────────────────────────────────────
    const handleResetFilters = useCallback(() => {
        setSearchKeyword('');
        setSelectedCategoryId(null);
        setMinPrice('');
        setMaxPrice('');
        setInStockOnly(false);
        setSortBy('newest');
        setCurrentPage(1);
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter((item) => {
            if (searchKeyword && !item.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
            if (inStockOnly && item.stockQuantity <= 0) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'priceAsc') return a.price - b.price;
            if (sortBy === 'priceDesc') return b.price - a.price;
            return b.id - a.id;
        });
    }, [products, searchKeyword, inStockOnly, sortBy]);

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchKeyword, minPrice, maxPrice, inStockOnly, sortBy, selectedCategoryId]);

    // ─── PAGINATION ────────────────────────────────────────────────────
    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredAndSortedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Active filter count
    const activeFilterCount = [searchKeyword, selectedCategoryId, minPrice, maxPrice, inStockOnly].filter(Boolean).length;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            {/* ═══════════════ INLINE STYLES ═══════════════ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                /* ── SHOP HERO ── */
                .shop-hero {
                    background: linear-gradient(135deg, #070707 0%, #141414 50%, #260307 100%);
                    padding: 56px 0 48px;
                    position: relative;
                    overflow: hidden;
                }
                .shop-hero::before {
                    content: '';
                    position: absolute;
                    top: -40%;
                    right: -10%;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(229,9,20,0.18) 0%, transparent 70%);
                    pointer-events: none;
                }
                .shop-hero::after {
                    content: '';
                    position: absolute;
                    bottom: -30%;
                    left: -5%;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(229,9,20,0.10) 0%, transparent 70%);
                    pointer-events: none;
                }
                .shop-hero__title {
                    font-family: 'Inter', sans-serif;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -1px;
                    line-height: 1.1;
                    margin-bottom: 10px;
                }
                .shop-hero__accent {
                    background: linear-gradient(135deg, #e50914, #ff2d38);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .shop-hero__subtitle {
                    color: #b8b8b8;
                    font-size: 1rem;
                    max-width: 500px;
                    margin-bottom: 0;
                }
                .shop-hero__stats {
                    display: flex;
                    gap: 32px;
                    margin-top: 24px;
                }
                .shop-hero__stat {
                    text-align: center;
                }
                .shop-hero__stat-value {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #fff;
                    line-height: 1;
                }
                .shop-hero__stat-label {
                    font-size: 0.75rem;
                    color: #8f8f8f;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 4px;
                }

                /* ── CATEGORY PILLS ── */
                .category-pills-wrapper {
                    background: #fff;
                    border-bottom: 1px solid #f1f5f9;
                    padding: 16px 0;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                }
                .category-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 20px;
                    border-radius: 100px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    white-space: nowrap;
                    font-family: 'Inter', sans-serif;
                }
                .category-pill:hover {
                    border-color: #e50914;
                    color: #e50914;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(229,9,20,0.18);
                }
                .category-pill.active {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 16px rgba(229,9,20,0.28);
                    transform: translateY(-2px);
                }

                /* ── MAIN LAYOUT ── */
                .shop-main {
                    background: #f8fafc;
                    padding: 32px 0 60px;
                    font-family: 'Inter', sans-serif;
                    min-height: 60vh;
                }
                .shop-content-area {
                    display: flex;
                    gap: 28px;
                }

                /* ── FILTER SIDEBAR ── */
                .filter-sidebar {
                    width: 280px;
                    min-width: 280px;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                .filter-sidebar.collapsed {
                    width: 0;
                    min-width: 0;
                    overflow: hidden;
                    opacity: 0;
                }
                .filter-panel {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    margin-bottom: 16px;
                    overflow: hidden;
                }
                .filter-panel__header {
                    padding: 16px 20px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #070707;
                    border-bottom: 1px solid #f8fafc;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .filter-panel__header i {
                    font-size: 14px;
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .filter-panel__body {
                    padding: 16px 20px;
                }
                .filter-category-item {
                    width: 100%;
                    text-align: left;
                    background: transparent;
                    border: none;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: #475569;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    margin-bottom: 2px;
                }
                .filter-category-item:hover {
                    background: #f8fafc;
                    color: #070707;
                    padding-left: 18px;
                }
                .filter-category-item.active {
                    background: linear-gradient(135deg, rgba(229,9,20,0.12), rgba(159,7,16,0.12));
                    color: #e50914;
                    font-weight: 600;
                    padding-left: 18px;
                }
                .filter-category-item .count-badge {
                    font-size: 11px;
                    background: #f1f5f9;
                    color: #8f8f8f;
                    padding: 2px 8px;
                    border-radius: 100px;
                    font-weight: 600;
                }
                .filter-category-item.active .count-badge {
                    background: rgba(229,9,20,0.18);
                    color: #e50914;
                }
                .filter-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 13px;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                    background: #fff;
                }
                .filter-input:focus {
                    border-color: #e50914;
                    box-shadow: 0 0 0 3px rgba(229,9,20,0.18);
                    outline: none;
                }
                .filter-input::placeholder {
                    color: #b8b8b8;
                }
                .price-divider {
                    color: #cbd5e1;
                    font-weight: 700;
                    font-size: 16px;
                }
                .filter-checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 4px 0;
                }
                .filter-checkbox {
                    width: 18px;
                    height: 18px;
                    border-radius: 5px;
                    border: 2px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    cursor: pointer;
                }
                .filter-checkbox.checked {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    border-color: transparent;
                }
                .filter-checkbox.checked::after {
                    content: '✓';
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                }
                .filter-reset-btn {
                    width: 100%;
                    padding: 12px;
                    border-radius: 12px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                }
                .filter-reset-btn:hover {
                    background: #f8fafc;
                    border-color: #e50914;
                    color: #e50914;
                }

                /* ── PRODUCTS AREA ── */
                .products-area {
                    flex: 1;
                    min-width: 0;
                }

                /* ── TOP BAR ── */
                .shop-toolbar {
                    background: #fff;
                    border-radius: 14px;
                    padding: 14px 20px;
                    border: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
                }
                .toolbar-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .toolbar-result-text {
                    font-size: 14px;
                    color: #8f8f8f;
                    font-weight: 500;
                }
                .toolbar-result-text strong {
                    color: #070707;
                    font-weight: 700;
                }
                .toggle-sidebar-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    color: #8f8f8f;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .toggle-sidebar-btn:hover {
                    border-color: #e50914;
                    color: #e50914;
                }
                .toolbar-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .view-toggle-group {
                    display: flex;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .view-toggle-btn {
                    width: 36px;
                    height: 34px;
                    border: none;
                    background: #fff;
                    color: #b8b8b8;
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .view-toggle-btn.active {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                }
                .sort-dropdown {
                    padding: 8px 16px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #475569;
                    background: #fff;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    min-width: 180px;
                    transition: border-color 0.2s ease;
                }
                .sort-dropdown:focus {
                    outline: none;
                    border-color: #e50914;
                }

                /* ── PRODUCT GRID ── */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    animation: gridFadeIn 0.4s ease-out;
                }
                .products-grid.list-mode {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @keyframes gridFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── PRODUCT CARD ── */
                .shop-product-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    cursor: pointer;
                }
                .shop-product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
                    border-color: transparent;
                }
                .shop-product-card:hover .card-overlay {
                    opacity: 1;
                    visibility: visible;
                }
                .shop-product-card:hover .card-img img {
                    transform: scale(1.08);
                }
                .card-img {
                    position: relative;
                    height: 260px;
                    overflow: hidden;
                    background: #f8fafc;
                }
                .card-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .card-badges {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    z-index: 2;
                }
                .card-badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 10.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .card-badge--hot {
                    background: linear-gradient(135deg, #ef4444, #f97316);
                    color: #fff;
                }
                .card-badge--low {
                    background: rgba(0,0,0,0.7);
                    color: #fbbf24;
                    backdrop-filter: blur(4px);
                }
                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(15,23,42,0.4);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 3;
                }
                .overlay-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    border: none;
                    background: rgba(255,255,255,0.95);
                    color: #070707;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .overlay-btn:hover {
                    background: #e50914;
                    color: #fff;
                    transform: scale(1.1);
                }
                .card-info {
                    padding: 16px 18px 18px;
                }
                .card-category-tag {
                    font-size: 11px;
                    font-weight: 600;
                    color: #e50914;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 6px;
                }
                .card-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #070707;
                    margin-bottom: 8px;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .card-price-row {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .card-price {
                    font-size: 18px;
                    font-weight: 800;
                    color: #ef4444;
                    font-family: 'Inter', sans-serif;
                }
                .card-stock {
                    font-size: 11.5px;
                    color: #b8b8b8;
                    font-weight: 500;
                }
                .card-stock.low {
                    color: #f59e0b;
                }
                .card-actions {
                    display: flex;
                    gap: 8px;
                }
                .card-btn {
                    flex: 1;
                    padding: 10px 0;
                    border-radius: 10px;
                    border: none;
                    font-size: 12.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    text-decoration: none;
                }
                .card-btn--outline {
                    background: #fff;
                    color: #475569;
                    border: 1.5px solid #e2e8f0;
                }
                .card-btn--outline:hover {
                    border-color: #e50914;
                    color: #e50914;
                }
                .card-btn--primary {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(229,9,20,0.25);
                }
                .card-btn--primary:hover {
                    box-shadow: 0 4px 16px rgba(229,9,20,0.35);
                    transform: translateY(-1px);
                }

                /* ── LIST VIEW CARD ── */
                .shop-product-card.list-card {
                    display: flex;
                    flex-direction: row;
                }
                .list-card .card-img {
                    width: 220px;
                    min-width: 220px;
                    height: auto;
                    min-height: 180px;
                }
                .list-card .card-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* ── PAGINATION ── */
                .pagination-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                    margin-top: 36px;
                }
                .page-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    color: #475569;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                }
                .page-btn:hover:not(.active):not(:disabled) {
                    border-color: #e50914;
                    color: #e50914;
                }
                .page-btn.active {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 12px rgba(229,9,20,0.25);
                }
                .page-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                /* ── QUICK VIEW MODAL ── */
                .quickview-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(15,23,42,0.55);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    animation: qvFadeIn 0.25s ease;
                }
                @keyframes qvFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .quickview-modal {
                    background: #fff;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    width: 100%;
                    max-width: 840px;
                    max-height: 85vh;
                    overflow-y: auto;
                    position: relative;
                    animation: qvSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes qvSlideUp {
                    from { transform: translateY(24px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .qv-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    border: none;
                    color: #8f8f8f;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .qv-close:hover {
                    background: #e2e8f0;
                    color: #070707;
                    transform: rotate(90deg);
                }
                .qv-body {
                    display: flex;
                    flex-direction: row;
                }
                .qv-img {
                    width: 50%;
                    min-height: 400px;
                    background: #f8fafc;
                    overflow: hidden;
                }
                .qv-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .qv-details {
                    flex: 1;
                    padding: 32px 28px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .qv-name {
                    font-family: 'Inter', sans-serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #070707;
                    margin-bottom: 12px;
                    line-height: 1.3;
                }
                .qv-price {
                    font-family: 'Inter', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    color: #ef4444;
                    margin-bottom: 16px;
                }
                .qv-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 24px;
                }
                .qv-meta-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 14px;
                    background: #f8fafc;
                    border-radius: 10px;
                    font-size: 13.5px;
                }
                .qv-meta-item span:first-child {
                    color: #8f8f8f;
                    font-weight: 500;
                }
                .qv-meta-item span:last-child {
                    color: #070707;
                    font-weight: 600;
                }
                .qv-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: auto;
                }
                .qv-btn {
                    flex: 1;
                    padding: 14px 0;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                    text-decoration: none;
                    border: none;
                }
                .qv-btn--detail {
                    background: #f1f5f9;
                    color: #475569;
                }
                .qv-btn--detail:hover {
                    background: #e2e8f0;
                    color: #070707;
                }
                .qv-btn--cart {
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(229,9,20,0.28);
                }
                .qv-btn--cart:hover {
                    box-shadow: 0 6px 24px rgba(229,9,20,0.4);
                    transform: translateY(-2px);
                }

                /* ── EMPTY STATE ── */
                .empty-state {
                    text-align: center;
                    padding: 60px 32px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                }
                .empty-state__icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(229,9,20,0.18), rgba(139,92,246,0.1));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 32px;
                    color: #e50914;
                }
                .empty-state__image {
                    width: 96px;
                    height: 96px;
                    object-fit: contain;
                    margin-bottom: 16px;
                    filter: drop-shadow(0 14px 24px rgba(229,9,20,0.18));
                }
                .empty-state__title {
                    font-family: 'Inter', sans-serif;
                    font-size: 20px;
                    font-weight: 700;
                    color: #070707;
                    margin-bottom: 8px;
                }
                .empty-state__desc {
                    color: #8f8f8f;
                    font-size: 14px;
                    max-width: 400px;
                    margin: 0 auto 20px;
                    line-height: 1.6;
                }
                .empty-state__btn {
                    padding: 12px 28px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #e50914, #9f0710);
                    color: #fff;
                    border: none;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                }
                .empty-state__btn:hover {
                    box-shadow: 0 4px 16px rgba(229,9,20,0.35);
                    transform: translateY(-2px);
                }

                /* ── LOADING SKELETON ── */
                .skeleton-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                .skeleton-card {
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #f1f5f9;
                }
                .skeleton-img {
                    height: 260px;
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf1 37%, #f1f5f9 63%);
                    background-size: 400% 100%;
                    animation: skeletonShimmer 1.5s ease infinite;
                }
                .skeleton-body {
                    padding: 16px 18px;
                }
                .skeleton-line {
                    height: 14px;
                    border-radius: 7px;
                    background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf1 37%, #f1f5f9 63%);
                    background-size: 400% 100%;
                    animation: skeletonShimmer 1.5s ease infinite;
                    margin-bottom: 10px;
                }
                .skeleton-line.w60 { width: 60%; }
                .skeleton-line.w80 { width: 80%; }
                .skeleton-line.w40 { width: 40%; }
                @keyframes skeletonShimmer {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 991px) {
                    .products-grid { grid-template-columns: repeat(2, 1fr); }
                    .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
                    .filter-sidebar { width: 240px; min-width: 240px; }
                    .shop-hero__title { font-size: 2rem; }
                    .qv-body { flex-direction: column; }
                    .qv-img { width: 100%; min-height: 260px; }
                }
                @media (max-width: 767px) {
                    .products-grid { grid-template-columns: repeat(2, 1fr); }
                    .filter-sidebar { display: none; }
                    .shop-hero__stats { gap: 20px; }
                    .shop-hero__title { font-size: 1.6rem; }
                    .card-img { height: 200px; }
                    .list-card .card-img { width: 140px; min-width: 140px; }
                }
                @media (max-width: 480px) {
                    .products-grid { grid-template-columns: 1fr; gap: 14px; }
                }
            `}</style>

            {/* ═══════════════ HERO BANNER ═══════════════ */}
            <section className="shop-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <h1 className="shop-hero__title">
                                Khám phá<br/>
                                <span className="shop-hero__accent">Bộ sưu tập mới nhất</span>
                            </h1>
                            <p className="shop-hero__subtitle">
                                Hơn ngàn sản phẩm thời trang cao cấp, từ streetwear đến haute couture — 
                                tất cả đều có tại LeTrongBaoCMS Fashion.
                            </p>
                            <div className="shop-hero__stats">
                                <div className="shop-hero__stat">
                                    <div className="shop-hero__stat-value">{products.length}+</div>
                                    <div className="shop-hero__stat-label">Sản phẩm</div>
                                </div>
                                <div className="shop-hero__stat">
                                    <div className="shop-hero__stat-value">{categories.length}</div>
                                    <div className="shop-hero__stat-label">Danh mục</div>
                                </div>
                                <div className="shop-hero__stat">
                                    <div className="shop-hero__stat-value">24/7</div>
                                    <div className="shop-hero__stat-label">Hỗ trợ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ CATEGORY PILLS ═══════════════ */}
            <div className="category-pills-wrapper">
                <div className="container">
                    <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                        <button
                            className={`category-pill ${selectedCategoryId === null ? 'active' : ''}`}
                            onClick={() => setSelectedCategoryId(null)}
                        >
                            <i className="fas fa-th-large"></i>
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-pill ${selectedCategoryId === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategoryId(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════ MAIN CONTENT ═══════════════ */}
            <div className="shop-main">
                <div className="container">
                    <div className="shop-content-area">

                        {/* ────── SIDEBAR FILTERS ────── */}
                        <aside className={`filter-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                            {/* Search */}
                            <div className="filter-panel">
                                <div className="filter-panel__header">
                                    <i className="fas fa-search" style={{ background: 'linear-gradient(135deg, rgba(229,9,20,0.18), rgba(139,92,246,0.1))', color: '#e50914' }}></i>
                                    Tìm kiếm
                                </div>
                                <div className="filter-panel__body">
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Nhập tên sản phẩm..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="filter-panel">
                                <div className="filter-panel__header">
                                    <i className="fas fa-layer-group" style={{ background: 'linear-gradient(135deg, rgba(229,9,20,0.12), rgba(159,7,16,0.12))', color: '#ff2d38' }}></i>
                                    Danh mục
                                </div>
                                <div className="filter-panel__body" style={{ padding: '8px 12px' }}>
                                    {loadingCategories ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                className={`filter-category-item ${selectedCategoryId === null ? 'active' : ''}`}
                                                onClick={() => setSelectedCategoryId(null)}
                                            >
                                                <span>Tất cả sản phẩm</span>
                                                <span className="count-badge">{products.length}</span>
                                            </button>
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    className={`filter-category-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedCategoryId(cat.id)}
                                                >
                                                    <span>{cat.name}</span>
                                                    <i className="fas fa-chevron-right" style={{ fontSize: '10px', opacity: 0.3 }}></i>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="filter-panel">
                                <div className="filter-panel__header">
                                    <i className="fas fa-tag" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))', color: '#f59e0b' }}></i>
                                    Khoảng giá (đ)
                                </div>
                                <div className="filter-panel__body">
                                    <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                        <input
                                            type="number"
                                            className="filter-input"
                                            placeholder="Từ"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                        <span className="price-divider">—</span>
                                        <input
                                            type="number"
                                            className="filter-input"
                                            placeholder="Đến"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stock Filter */}
                            <div className="filter-panel">
                                <div className="filter-panel__header">
                                    <i className="fas fa-boxes" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1))', color: '#ef4444' }}></i>
                                    Tình trạng kho
                                </div>
                                <div className="filter-panel__body">
                                    <div
                                        className="filter-checkbox-row"
                                        onClick={() => setInStockOnly(!inStockOnly)}
                                    >
                                        <div className={`filter-checkbox ${inStockOnly ? 'checked' : ''}`}></div>
                                        <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500 }}>
                                            Chỉ hiện sản phẩm còn hàng
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reset */}
                            {activeFilterCount > 0 && (
                                <button className="filter-reset-btn" onClick={handleResetFilters}>
                                    <i className="fas fa-times-circle"></i>
                                    Xóa {activeFilterCount} bộ lọc
                                </button>
                            )}
                        </aside>

                        {/* ────── PRODUCTS AREA ────── */}
                        <div className="products-area">
                            {/* Toolbar */}
                            <div className="shop-toolbar">
                                <div className="toolbar-left">
                                    <button
                                        className="toggle-sidebar-btn"
                                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                        title={sidebarCollapsed ? 'Hiện bộ lọc' : 'Ẩn bộ lọc'}
                                    >
                                        <i className={`fas fa-${sidebarCollapsed ? 'filter' : 'indent'}`}></i>
                                    </button>
                                    <span className="toolbar-result-text">
                                        Hiển thị <strong>{filteredAndSortedProducts.length}</strong> sản phẩm
                                        {activeFilterCount > 0 && (
                                            <span style={{ marginLeft: '6px', color: '#e50914' }}>
                                                ({activeFilterCount} bộ lọc)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="toolbar-right">
                                    <div className="view-toggle-group">
                                        <button
                                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                            title="Xem dạng lưới"
                                        >
                                            <i className="fas fa-th"></i>
                                        </button>
                                        <button
                                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewMode('list')}
                                            title="Xem dạng danh sách"
                                        >
                                            <i className="fas fa-list"></i>
                                        </button>
                                    </div>
                                    <select
                                        className="sort-dropdown"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="priceAsc">Giá: Thấp → Cao</option>
                                        <option value="priceDesc">Giá: Cao → Thấp</option>
                                    </select>
                                </div>
                            </div>

                            {/* Product Grid / Loading / Empty */}
                            {loadingProducts ? (
                                <div className="skeleton-grid">
                                    {[...Array(6)].map((_, i) => (
                                        <div className="skeleton-card" key={i}>
                                            <div className="skeleton-img"></div>
                                            <div className="skeleton-body">
                                                <div className="skeleton-line w80"></div>
                                                <div className="skeleton-line w60"></div>
                                                <div className="skeleton-line w40"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="empty-state">
                                    <div className="empty-state__icon">
                                        <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444' }}></i>
                                    </div>
                                    <h3 className="empty-state__title">Đã xảy ra lỗi</h3>
                                    <p className="empty-state__desc">{error}</p>
                                </div>
                            ) : paginatedProducts.length > 0 ? (
                                <>
                                    <div className={`products-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
                                        {paginatedProducts.map((product, idx) => (
                                            <div
                                                className={`shop-product-card ${viewMode === 'list' ? 'list-card' : ''}`}
                                                key={product.id}
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                {/* Image */}
                                                <div className="card-img">
                                                    <img
                                                        src={getImageUrl(product.imageUrl, 'https://placehold.co/400x320/f1f5f9/94a3b8?text=No+Image')}
                                                        alt={product.name}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x320/f1f5f9/94a3b8?text=No+Image'; }}
                                                    />
                                                    {/* Badges */}
                                                    <div className="card-badges">
                                                        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                                                            <span className="card-badge card-badge--hot">
                                                                <i className="fas fa-fire mr-1"></i> Hot
                                                            </span>
                                                        )}
                                                        {product.stockQuantity <= 0 && (
                                                            <span className="card-badge card-badge--low">Hết hàng</span>
                                                        )}
                                                    </div>
                                                    {/* Hover Overlay */}
                                                    <div className="card-overlay">
                                                        <button
                                                            className="overlay-btn"
                                                            title="Xem nhanh"
                                                            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <Link
                                                            to={`/product/${product.id}`}
                                                            className="overlay-btn"
                                                            title="Chi tiết"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <i className="fas fa-external-link-alt"></i>
                                                        </Link>
                                                        <button
                                                            className="overlay-btn"
                                                            title="Thêm vào giỏ"
                                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                        >
                                                            <i className="fas fa-cart-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="card-info">
                                                    <div className="card-category-tag">
                                                        {categories.find(c => c.id === product.categoryProductId)?.name || 'Thời trang'}
                                                    </div>
                                                    <h3 className="card-title" title={product.name}>{product.name}</h3>
                                                    <div className="card-price-row">
                                                        <span className="card-price">{formatCurrency(product.price)}</span>
                                                    </div>
                                                    <div style={{ marginBottom: '12px' }}>
                                                        <span className={`card-stock ${product.stockQuantity <= 5 ? 'low' : ''}`}>
                                                            <i className="fas fa-warehouse mr-1" style={{ fontSize: '10px' }}></i>
                                                            {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Tạm hết hàng'}
                                                        </span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <Link to={`/product/${product.id}`} className="card-btn card-btn--outline">
                                                            <i className="fas fa-eye"></i> Chi tiết
                                                        </Link>
                                                        <button
                                                            className="card-btn card-btn--primary"
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            <i className="fas fa-cart-plus"></i> Mua ngay
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="pagination-wrapper">
                                            <button
                                                className="page-btn"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(p => p - 1)}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                className="page-btn"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(p => p + 1)}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                                        alt="Không tìm thấy sản phẩm"
                                        className="empty-state__image"
                                    />
                                    <h3 className="empty-state__title">Không tìm thấy sản phẩm</h3>
                                    <p className="empty-state__desc">
                                        Không tìm thấy sản phẩm nào phù hợp với yêu cầu bạn.
                                    </p>
                                    <button className="empty-state__btn" onClick={handleResetFilters}>
                                        <i className="fas fa-undo-alt mr-1"></i> Đặt lại bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ QUICK VIEW MODAL ═══════════════ */}
            {quickViewProduct && (
                <div className="quickview-backdrop" onClick={() => setQuickViewProduct(null)}>
                    <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="qv-close" onClick={() => setQuickViewProduct(null)}>
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="qv-body">
                            <div className="qv-img">
                                <img
                                    src={getImageUrl(quickViewProduct.imageUrl, 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image')}
                                    alt={quickViewProduct.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image'; }}
                                />
                            </div>
                            <div className="qv-details">
                                <div className="card-category-tag" style={{ marginBottom: '8px' }}>
                                    {categories.find(c => c.id === quickViewProduct.categoryProductId)?.name || 'Thời trang'}
                                </div>
                                <h2 className="qv-name">{quickViewProduct.name}</h2>
                                <div className="qv-price">{formatCurrency(quickViewProduct.price)}</div>
                                <div className="qv-meta">
                                    <div className="qv-meta-item">
                                        <span>Mã sản phẩm</span>
                                        <span>#{quickViewProduct.id}</span>
                                    </div>
                                    <div className="qv-meta-item">
                                        <span>Tồn kho</span>
                                        <span style={{ color: quickViewProduct.stockQuantity > 0 ? '#ff2d38' : '#ef4444' }}>
                                            {quickViewProduct.stockQuantity > 0 ? `${quickViewProduct.stockQuantity} sản phẩm` : 'Hết hàng'}
                                        </span>
                                    </div>
                                    <div className="qv-meta-item">
                                        <span>Danh mục</span>
                                        <span>{categories.find(c => c.id === quickViewProduct.categoryProductId)?.name || '—'}</span>
                                    </div>
                                </div>
                                <div className="qv-actions">
                                    <Link to={`/product/${quickViewProduct.id}`} className="qv-btn qv-btn--detail">
                                        <i className="fas fa-info-circle"></i> Xem chi tiết
                                    </Link>
                                    <button
                                        className="qv-btn qv-btn--cart"
                                        onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                                    >
                                        <i className="fas fa-cart-plus"></i> Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Shop;
