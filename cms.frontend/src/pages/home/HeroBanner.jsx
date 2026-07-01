import React, { useEffect, useState } from 'react';
import bannerService from '../../services/bannerService';
import { getImageUrl } from '../../utils/imageHelper';
import './HeroBanner.css';

function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await bannerService.getAll(true);
                const bannerData = Array.isArray(data) ? data : [];
                const homeBanners = bannerData.filter((item) =>
                    String(item.position || '').toLowerCase() === 'home'
                );

                setBanners(homeBanners.length > 0 ? homeBanners : bannerData);
            } catch (error) {
                console.error('Loi khi tai banner trang chu:', error);
            }
        };

        fetchBanner();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return undefined;

        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % banners.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const fallbackBanner = {
        id: 'fallback',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop'
    };
    const slides = banners.length > 0 ? banners : [fallbackBanner];
    const activeBanner = slides[activeIndex] || slides[0];
    const bannerImage = getImageUrl(
        activeBanner?.imageUrl,
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop'
    );

    const goToPrevious = () => {
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setActiveIndex((current) => (current + 1) % slides.length);
    };

    return (
        <section className="mz-hero">
            <div className="mz-hero__slide" key={activeBanner.id || activeIndex}>
                <img className="mz-hero__image" src={bannerImage} alt="Banner trang chu" />
            </div>

            {slides.length > 1 && (
                <>
                    <button className="mz-hero__nav mz-hero__nav--prev" type="button" onClick={goToPrevious} aria-label="Banner truoc">
                        <span aria-hidden="true">‹</span>
                    </button>
                    <button className="mz-hero__nav mz-hero__nav--next" type="button" onClick={goToNext} aria-label="Banner sau">
                        <span aria-hidden="true">›</span>
                    </button>

                    <div className="mz-hero__dots">
                        {slides.map((item, index) => (
                            <button
                                key={item.id || index}
                                className={index === activeIndex ? 'active' : ''}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Chuyen den banner ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default HeroBanner;
