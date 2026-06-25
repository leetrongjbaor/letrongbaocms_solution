import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ========================================================================
//  TRANG "VỀ CHÚNG TÔI" — GADGETHUB.STORE
//  Hero Carousel lấy cảm hứng từ TOONHUB + Nội dung giới thiệu cửa hàng
//  Gaming Gear & Phụ Kiện Công Nghệ
// ========================================================================

// ─── DỮ LIỆU HÌNH ẢNH VÀ MÀU SẮC CHO CAROUSEL ───────────────────────
const IMAGES = [
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

// ─── SVG GRAIN OVERLAY DATA URI ────────────────────────────────────────
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;


function About() {
    // ─── CAROUSEL STATE ────────────────────────────────────────────────
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    // Preload tất cả hình ảnh khi component mount
    useEffect(() => {
        IMAGES.forEach((item) => {
            const img = new Image();
            img.src = item.src;
        });
    }, []);

    // Theo dõi responsive
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ─── NAVIGATE CAROUSEL ────────────────────────────────────────────
    const navigate = useCallback((direction) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex((prev) =>
            direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
        );
        setTimeout(() => setIsAnimating(false), 650);
    }, [isAnimating]);

    // Tính toán vai trò của mỗi hình ảnh dựa trên activeIndex
    const roles = {
        center: activeIndex,
        left: (activeIndex + 3) % 4,
        right: (activeIndex + 1) % 4,
        back: (activeIndex + 2) % 4,
    };

    // ─── STYLE CHO MỖI VỊ TRÍ TRONG CAROUSEL ─────────────────────────
    const getRoleStyle = (index) => {
        const transition = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)';
        const willChange = 'transform, filter, opacity';

        if (index === roles.center) {
            return {
                position: 'absolute',
                aspectRatio: '0.6 / 1',
                transform: 'translateX(-50%) scale(1.15)',
                filter: 'blur(0px)',
                opacity: 1,
                zIndex: 20,
                left: '50%',
                height: '90%',
                bottom: '0',
                transition,
                willChange,
            };
        }
        if (index === roles.left) {
            return {
                position: 'absolute',
                aspectRatio: '0.6 / 1',
                transform: 'translateX(-50%) scale(0.95)',
                filter: 'blur(2px)',
                opacity: 0.75,
                zIndex: 10,
                left: '20%',
                height: '70%',
                bottom: '5%',
                transition,
                willChange,
            };
        }
        if (index === roles.right) {
            return {
                position: 'absolute',
                aspectRatio: '0.6 / 1',
                transform: 'translateX(-50%) scale(0.95)',
                filter: 'blur(2px)',
                opacity: 0.75,
                zIndex: 10,
                left: '80%',
                height: '70%',
                bottom: '5%',
                transition,
                willChange,
            };
        }
        // back
        return {
            position: 'absolute',
            aspectRatio: '0.6 / 1',
            transform: 'translateX(-50%) scale(0.8)',
            filter: 'blur(4px)',
            opacity: 0.5,
            zIndex: 5,
            left: '50%',
            height: '60%',
            bottom: '12%',
            transition,
            willChange,
        };
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <Header />

            {/* ═══════════════ INLINE STYLES ═══════════════ */}
            <style>{`
                /* ── HERO SECTION ── */
                .about-hero-outer {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    transition: background-color 650ms cubic-bezier(0.4,0,0.2,1);
                    border-radius: 20px;
                    margin: 32px 0;
                }
                .about-hero-inner {
                    position: relative;
                    width: 100%;
                    min-height: 480px;
                    display: grid;
                    grid-template-columns: 1.15fr 0.85fr;
                    gap: 32px;
                    padding: 56px 40px;
                    align-items: center;
                    overflow: hidden;
                }
                @media (max-width: 860px) {
                    .about-hero-inner {
                        grid-template-columns: 1fr;
                        padding: 40px 24px;
                        gap: 40px;
                        min-height: auto;
                        text-align: center;
                    }
                }

                /* Grain overlay */
                .about-grain {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.4;
                    background-size: 200px 200px;
                    background-repeat: repeat;
                }

                /* Giant ghost text */
                .about-ghost-text {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    user-select: none;
                    z-index: 2;
                    top: 10%;
                }
                .about-ghost-text span {
                    font-family: 'Anton', sans-serif;
                    font-size: clamp(60px, 18vw, 220px);
                    font-weight: 900;
                    color: #fff;
                    opacity: 0.25;
                    line-height: 1;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    white-space: nowrap;
                }

                /* Brand label */
                .about-brand-label {
                    position: absolute;
                    top: 24px;
                    left: 40px;
                    z-index: 60;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: #fff;
                    opacity: 0.9;
                    letter-spacing: 0.18em;
                }
                @media (max-width: 860px) {
                    .about-brand-label {
                        display: none;
                    }
                }

                /* Layout left/right columns */
                .about-hero-left {
                    position: relative;
                    z-index: 10;
                    font-family: 'Inter', sans-serif;
                    text-align: left;
                }
                @media (max-width: 860px) {
                    .about-hero-left {
                        text-align: center;
                        margin-top: 24px;
                    }
                }

                .about-hero-right {
                    position: relative;
                    width: 100%;
                    height: 380px;
                    z-index: 10;
                }
                @media (max-width: 860px) {
                    .about-hero-right {
                        height: 280px;
                    }
                }

                /* Carousel items */
                .about-carousel {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                }
                .about-carousel-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: bottom center;
                    user-select: none;
                }

                /* Bottom-left info styled for left column */
                .about-bottom-left {
                    max-width: 100%;
                }
                .about-bottom-left__title {
                    font-weight: 800;
                    font-family: 'Anton', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    margin-bottom: 12px;
                    font-size: 28px;
                    color: #fff;
                    line-height: 1.2;
                }
                .about-bottom-left__desc {
                    font-size: 14px;
                    color: #fff;
                    opacity: 0.9;
                    line-height: 1.6;
                    margin-bottom: 24px;
                }
                .about-nav-btns {
                    display: flex;
                    gap: 10px;
                }
                @media (max-width: 860px) {
                    .about-nav-btns {
                        justify-content: center;
                    }
                }
                .about-nav-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: transparent;
                    border: 2.5px solid #fff;
                    color: #fff;
                    font-size: 15px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 150ms ease, background-color 150ms ease;
                }
                .about-nav-btn:hover {
                    transform: scale(1.08);
                    background-color: rgba(255,255,255,0.12);
                }

                /* Discover link */
                .about-discover-link {
                    position: absolute;
                    bottom: 24px;
                    right: 40px;
                    z-index: 60;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'Anton', sans-serif;
                    font-size: 20px;
                    font-weight: 400;
                    color: #fff;
                    opacity: 0.95;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: opacity 200ms ease;
                }
                @media (max-width: 860px) {
                    .about-discover-link {
                        position: static;
                        display: inline-flex;
                        justify-content: center;
                        margin-top: 16px;
                        font-size: 16px;
                    }
                }
                .about-discover-link:hover {
                    opacity: 1;
                    color: #fff;
                    text-decoration: none;
                }
                .about-discover-icon {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ═══════════════ ABOUT SECTIONS ═══════════════ */
                .about-section {
                    padding: 80px 0;
                    font-family: 'Inter', sans-serif;
                }
                .about-section--dark {
                    background: #0f172a;
                    color: #fff;
                }
                .about-section--light {
                    background: #f8fafc;
                    color: #0f172a;
                }
                .about-section--gradient {
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    color: #fff;
                }
                .about-section__eyebrow {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: #6366f1;
                    margin-bottom: 12px;
                }
                .about-section__title {
                    font-family: 'Anton', sans-serif;
                    font-size: clamp(28px, 5vw, 52px);
                    font-weight: 400;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                    margin-bottom: 20px;
                }
                .about-section__text {
                    font-size: 15px;
                    line-height: 1.8;
                    color: #94a3b8;
                    max-width: 620px;
                }
                .about-section--light .about-section__text {
                    color: #475569;
                }

                /* Value cards */
                .value-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 24px;
                    margin-top: 48px;
                }
                .value-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    padding: 32px 28px;
                    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
                    position: relative;
                    overflow: hidden;
                }
                .about-section--light .value-card {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }
                .value-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 40px rgba(99,102,241,0.12);
                    border-color: rgba(99,102,241,0.3);
                }
                .value-card__icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15));
                    color: #6366f1;
                }
                .about-section--light .value-card__icon {
                    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
                }
                .value-card__title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #fff;
                }
                .about-section--light .value-card__title {
                    color: #0f172a;
                }
                .value-card__desc {
                    font-size: 14px;
                    line-height: 1.7;
                    color: #94a3b8;
                }
                .about-section--light .value-card__desc {
                    color: #64748b;
                }

                /* Stats bar */
                .stats-bar {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0;
                    margin-top: 60px;
                }
                @media (max-width: 767px) {
                    .stats-bar { grid-template-columns: repeat(2, 1fr); }
                }
                .stat-item {
                    text-align: center;
                    padding: 32px 16px;
                    border-right: 1px solid rgba(255,255,255,0.08);
                }
                .stat-item:last-child { border-right: none; }
                .about-section--light .stat-item {
                    border-right-color: #e2e8f0;
                }
                .stat-item__value {
                    font-family: 'Anton', sans-serif;
                    font-size: clamp(32px, 5vw, 56px);
                    font-weight: 400;
                    line-height: 1;
                    margin-bottom: 8px;
                    background: linear-gradient(135deg, #6366f1, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .stat-item__label {
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                }

                /* Timeline */
                .timeline {
                    position: relative;
                    padding-left: 32px;
                    margin-top: 48px;
                }
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.1));
                }
                .timeline-item {
                    position: relative;
                    padding-bottom: 36px;
                }
                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: -37px;
                    top: 6px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.2);
                }
                .timeline-item__year {
                    font-family: 'Anton', sans-serif;
                    font-size: 20px;
                    color: #6366f1;
                    margin-bottom: 6px;
                }
                .timeline-item__title {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                .timeline-item__desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                }

                /* CTA Section */
                .about-cta {
                    text-align: center;
                    padding: 80px 24px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    position: relative;
                    overflow: hidden;
                }
                .about-cta::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
                }
                .about-cta__title {
                    font-family: 'Anton', sans-serif;
                    font-size: clamp(28px, 5vw, 48px);
                    font-weight: 400;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 2;
                }
                .about-cta__desc {
                    font-size: 16px;
                    color: rgba(255,255,255,0.85);
                    max-width: 500px;
                    margin: 0 auto 28px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 2;
                }
                .about-cta__btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 36px;
                    border-radius: 14px;
                    background: #fff;
                    color: #6366f1;
                    font-size: 15px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    position: relative;
                    z-index: 2;
                }
                .about-cta__btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.2);
                    color: #4f46e5;
                    text-decoration: none;
                }
            `}</style>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: HERO CAROUSEL — FULL VIEWPORT
            ═══════════════════════════════════════════════════════════════ */}
            <div className="container">
                <div
                    className="about-hero-outer"
                    style={{ backgroundColor: IMAGES[activeIndex].bg }}
                >
                    <div className="about-hero-inner">

                        {/* 1. Grain Overlay */}
                        <div
                            className="about-grain"
                            style={{ backgroundImage: GRAIN_SVG }}
                        />

                        {/* 2. Giant Ghost Text */}
                        <div className="about-ghost-text">
                            <span>GADGET</span>
                        </div>

                        {/* 3. Top-left Brand Label */}
                        <div className="about-brand-label">GADGETHUB.STORE</div>

                        {/* Left Column: Content */}
                        <div className="about-hero-left">
                            <div className="about-bottom-left">
                                <p className="about-bottom-left__title">
                                    GADGETHUB STORE
                                </p>
                                <p className="about-bottom-left__desc">
                                    Cửa hàng Gaming Gear & Phụ kiện Công nghệ hàng đầu.
                                    Chúng tôi mang đến những sản phẩm chất lượng cao từ các thương hiệu uy tín,
                                    phục vụ game thủ và những người đam mê công nghệ trên khắp Việt Nam.
                                </p>
                                <div className="about-nav-btns">
                                    <button
                                        className="about-nav-btn"
                                        onClick={() => navigate('prev')}
                                        aria-label="Previous"
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </button>
                                    <button
                                        className="about-nav-btn"
                                        onClick={() => navigate('next')}
                                        aria-label="Next"
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual Carousel */}
                        <div className="about-hero-right">
                            <div className="about-carousel">
                                {IMAGES.map((item, index) => (
                                    <div key={index} style={getRoleStyle(index)}>
                                        <img
                                            className="about-carousel-img"
                                            src={item.src}
                                            alt={`GadgetHub mascot ${index + 1}`}
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6. Bottom-right: Discover Link */}
                        <Link to="/shop" className="about-discover-link">
                            KHÁM PHÁ
                            <i className="fas fa-arrow-right about-discover-icon"></i>
                        </Link>
                    </div>
                </div>
            </div>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: GIỚI THIỆU VỀ CHÚNG TÔI
            ═══════════════════════════════════════════════════════════════ */}
            <section className="about-section about-section--dark">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="about-section__eyebrow">Về GadgetHub</div>
                            <h2 className="about-section__title">
                                Đam mê công nghệ,<br/>nâng tầm trải nghiệm
                            </h2>
                            <p className="about-section__text">
                                <strong style={{ color: '#fff' }}>GadgetHub.Store</strong> được thành lập với sứ mệnh
                                mang đến những sản phẩm gaming gear và phụ kiện công nghệ chính hãng, chất lượng cao
                                cho cộng đồng game thủ và dân công nghệ tại Việt Nam.
                            </p>
                            <p className="about-section__text" style={{ marginTop: '16px' }}>
                                Từ chuột gaming, bàn phím cơ, tai nghe pro đến các phụ kiện setup bàn làm việc —
                                mỗi sản phẩm tại GadgetHub đều được chọn lọc kỹ lưỡng, đảm bảo đáp ứng tiêu chuẩn
                                khắt khe nhất từ các game thủ chuyên nghiệp.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="value-grid" style={{ marginTop: 0 }}>
                                <div className="value-card">
                                    <div className="value-card__icon">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <h4 className="value-card__title">Chính hãng 100%</h4>
                                    <p className="value-card__desc">
                                        Cam kết tất cả sản phẩm đều là hàng chính hãng, có tem bảo hành và hóa đơn đầy đủ.
                                    </p>
                                </div>
                                <div className="value-card">
                                    <div className="value-card__icon">
                                        <i className="fas fa-truck"></i>
                                    </div>
                                    <h4 className="value-card__title">Giao hàng toàn quốc</h4>
                                    <p className="value-card__desc">
                                        Ship COD nhanh chóng đến mọi tỉnh thành. Miễn phí vận chuyển cho đơn hàng trên 500K.
                                    </p>
                                </div>
                                <div className="value-card">
                                    <div className="value-card__icon">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <h4 className="value-card__title">Hỗ trợ 24/7</h4>
                                    <p className="value-card__desc">
                                        Đội ngũ CSKH luôn sẵn sàng tư vấn, giải đáp mọi thắc mắc bất kể ngày đêm.
                                    </p>
                                </div>
                                <div className="value-card">
                                    <div className="value-card__icon">
                                        <i className="fas fa-undo-alt"></i>
                                    </div>
                                    <h4 className="value-card__title">Đổi trả dễ dàng</h4>
                                    <p className="value-card__desc">
                                        Chính sách đổi trả 1-1 trong 30 ngày nếu sản phẩm bị lỗi do nhà sản xuất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: CON SỐ NỔI BẬT
            ═══════════════════════════════════════════════════════════════ */}
            <section className="about-section about-section--light" style={{ paddingBottom: 0 }}>
                <div className="container">
                    <div className="text-center mb-4">
                        <div className="about-section__eyebrow">Thành tựu</div>
                        <h2 className="about-section__title">Những con số biết nói</h2>
                    </div>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-item__value">5K+</div>
                            <div className="stat-item__label">Khách hàng</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item__value">200+</div>
                            <div className="stat-item__label">Sản phẩm</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item__value">99%</div>
                            <div className="stat-item__label">Hài lòng</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item__value">24/7</div>
                            <div className="stat-item__label">Hỗ trợ</div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: HÀNH TRÌNH PHÁT TRIỂN
            ═══════════════════════════════════════════════════════════════ */}
            <section className="about-section about-section--light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="about-section__eyebrow">Hành trình</div>
                            <h2 className="about-section__title" style={{ color: '#0f172a' }}>
                                Từ đam mê<br/>đến thương hiệu
                            </h2>
                            <p className="about-section__text">
                                Được thành lập bởi những người trẻ đam mê gaming và công nghệ,
                                GadgetHub.Store đã từng bước khẳng định vị thế trên thị trường phụ kiện gaming Việt Nam.
                            </p>
                        </div>
                        <div className="col-lg-7">
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-item__year">2021</div>
                                    <h4 className="timeline-item__title" style={{ color: '#0f172a' }}>Khởi đầu đam mê</h4>
                                    <p className="timeline-item__desc">
                                        Ra đời từ một fanpage nhỏ chia sẻ review gaming gear,
                                        GadgetHub bắt đầu bán những sản phẩm đầu tiên qua mạng xã hội.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-item__year">2022</div>
                                    <h4 className="timeline-item__title" style={{ color: '#0f172a' }}>Mở rộng thương hiệu</h4>
                                    <p className="timeline-item__desc">
                                        Ra mắt website GadgetHub.Store chính thức, mở rộng danh mục sản phẩm lên hơn 100 SKU
                                        từ các thương hiệu Logitech, Razer, SteelSeries, HyperX.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-item__year">2023</div>
                                    <h4 className="timeline-item__title" style={{ color: '#0f172a' }}>Cộng đồng lớn mạnh</h4>
                                    <p className="timeline-item__desc">
                                        Đạt mốc 5,000 khách hàng thân thiết. Tổ chức các buổi offline gaming community,
                                        trở thành đối tác chính thức của nhiều thương hiệu quốc tế.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-item__year">2024</div>
                                    <h4 className="timeline-item__title" style={{ color: '#0f172a' }}>Hướng tới tương lai</h4>
                                    <p className="timeline-item__desc">
                                        Kế hoạch mở showroom trải nghiệm tại TP.HCM, ra mắt dòng sản phẩm tự thiết kế
                                        và hệ thống loyalty cho game thủ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5: SẢN PHẨM NỔI BẬT — CATEGORIES
            ═══════════════════════════════════════════════════════════════ */}
            <section className="about-section about-section--gradient">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="about-section__eyebrow" style={{ color: '#a78bfa' }}>Danh mục sản phẩm</div>
                        <h2 className="about-section__title">Trang bị cho game thủ</h2>
                    </div>
                    <div className="value-grid">
                        <div className="value-card" style={{ textAlign: 'center' }}>
                            <div className="value-card__icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(244,132,95,0.2), rgba(247,155,127,0.2))', color: '#F4845F' }}>
                                <i className="fas fa-mouse"></i>
                            </div>
                            <h4 className="value-card__title">Chuột Gaming</h4>
                            <p className="value-card__desc">
                                Chuột gaming DPI cao, sensor chính xác từ Logitech, Razer, Zowie cho mọi phong cách chơi.
                            </p>
                        </div>
                        <div className="value-card" style={{ textAlign: 'center' }}>
                            <div className="value-card__icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(107,191,122,0.2), rgba(133,204,146,0.2))', color: '#6BBF7A' }}>
                                <i className="fas fa-keyboard"></i>
                            </div>
                            <h4 className="value-card__title">Bàn phím cơ</h4>
                            <p className="value-card__desc">
                                Bàn phím cơ custom, hot-swap, RGB — từ phân khúc entry đến endgame cho cả game và gõ phím.
                            </p>
                        </div>
                        <div className="value-card" style={{ textAlign: 'center' }}>
                            <div className="value-card__icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(232,130,180,0.2), rgba(237,157,196,0.2))', color: '#E882B4' }}>
                                <i className="fas fa-headphones-alt"></i>
                            </div>
                            <h4 className="value-card__title">Tai nghe Pro</h4>
                            <p className="value-card__desc">
                                Tai nghe 7.1 surround, micro khử ồn, comfortable fit cho những session gaming marathon.
                            </p>
                        </div>
                        <div className="value-card" style={{ textAlign: 'center' }}>
                            <div className="value-card__icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(110,181,255,0.2), rgba(141,196,255,0.2))', color: '#6EB5FF' }}>
                                <i className="fas fa-desktop"></i>
                            </div>
                            <h4 className="value-card__title">Phụ kiện Setup</h4>
                            <p className="value-card__desc">
                                Mousepad, arm monitor, kê tay, LED strip — mọi thứ bạn cần để build setup gaming trong mơ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6: CTA — KÊU GỌI HÀNH ĐỘNG
            ═══════════════════════════════════════════════════════════════ */}
            <div className="about-cta">
                <h2 className="about-cta__title">
                    Sẵn sàng nâng cấp setup?
                </h2>
                <p className="about-cta__desc">
                    Khám phá bộ sưu tập gaming gear mới nhất tại GadgetHub.Store — nơi đam mê công nghệ gặp gỡ phong cách.
                </p>
                <Link to="/shop" className="about-cta__btn">
                    <i className="fas fa-shopping-bag"></i>
                    Ghé cửa hàng ngay
                    <i className="fas fa-arrow-right"></i>
                </Link>
            </div>


            <Footer />
        </div>
    );
}

export default About;
