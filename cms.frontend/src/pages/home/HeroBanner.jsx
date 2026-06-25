import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import './HeroBanner.css';

// "Sticker thông số" lấy từ các dòng laptop thật trong bài review —
// đây là điểm nhấn riêng của banner, mô phỏng tem cấu hình dán trên laptop.
const SPEC_SHEETS = [
    {
        series: 'ThinkPad T Series',
        tag: 'Hiệu năng & linh hoạt',
        cpu: 'Intel Core i7',
        ram: '16GB',
        price: '6.7tr – 31tr'
    },
    {
        series: 'ThinkPad X Series',
        tag: 'Siêu di động',
        cpu: 'Intel Core i5',
        ram: '8GB',
        price: '1.5kg'
    },
    {
        series: 'ThinkPad W Series',
        tag: 'Máy trạm đồ họa',
        cpu: 'Intel Core i7',
        ram: '15–17"',
        price: '11.5tr – 14.5tr'
    }
];

function HeroBanner() {
    const [active, setActive] = useState(0);
    const [latestPostId, setLatestPostId] = useState(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        const timer = setInterval(() => {
            setActive((i) => (i + 1) % SPEC_SHEETS.length);
        }, 3200);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchLatestPost = async () => {
            try {
                const data = await blogService.getAllPosts();
                if (data && data.length > 0) {
                    // Sắp xếp các bài viết giảm dần theo ID để tìm bài viết mới nhất
                    const sorted = [...data].sort((a, b) => b.id - a.id);
                    setLatestPostId(sorted[0].id);
                }
            } catch (error) {
                console.error("Lỗi khi tải bài viết mới nhất cho HeroBanner:", error);
            }
        };
        fetchLatestPost();
    }, []);

    const spec = SPEC_SHEETS[active];

    return (
        <section className="mz-hero">
            <div className="mz-hero__grid">
                <div className="mz-hero__copy">
                    <span className="mz-hero__eyebrow">MemoryZone — Tủ đồ laptop</span>

                    <h1 className="mz-hero__title">
                        Trước khi xuống tiền,
                        <br />
                        <span className="mz-hero__accent">đọc review thật trước.</span>
                    </h1>

                    <p className="mz-hero__subtitle">
                        Mỗi bài viết là cấu hình thật, mức giá thật và trải nghiệm dùng
                        hàng ngày — không phải thông số sao chép từ tờ rơi quảng cáo.
                    </p>

                    <div className="mz-hero__actions">
                        <Link 
                            to={latestPostId ? `/blog/${latestPostId}` : "/blog"} 
                            className="mz-btn mz-btn--primary"
                        >
                            Xem bài review mới nhất
                        </Link>
                        <Link to="/blog" className="mz-btn mz-btn--ghost">
                            Khám phá theo chuyên mục
                        </Link>
                    </div>
                </div>

                <div className="mz-hero__visual" aria-hidden="false">
                    <div className="mz-spec-card" role="status" aria-live="polite">
                        <div className="mz-spec-card__header">
                            <span className="mz-spec-card__dot" />
                            ĐANG REVIEW
                        </div>

                        <div className="mz-spec-card__series">{spec.series}</div>
                        <div className="mz-spec-card__tag">{spec.tag}</div>

                        <div className="mz-spec-card__rows">
                            <div className="mz-spec-card__row">
                                <span>CPU</span>
                                <strong>{spec.cpu}</strong>
                            </div>
                            <div className="mz-spec-card__row">
                                <span>RAM</span>
                                <strong>{spec.ram}</strong>
                            </div>
                            <div className="mz-spec-card__row">
                                <span>GIÁ</span>
                                <strong>{spec.price}</strong>
                            </div>
                        </div>

                        <div className="mz-spec-card__barcode" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;