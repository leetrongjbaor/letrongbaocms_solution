import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import bannerService from '../../services/bannerService';
import { getImageUrl } from '../../utils/imageHelper';
import './style.css';

const emptyForm = {
    title: '',
    subtitle: '',
    imageUrl: '',
    imageFile: null,
    linkUrl: '',
    position: 'Home',
    displayOrder: 0,
    isActive: true,
};

function BannerManagement() {
    const [banners, setBanners] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadBanners = async () => {
        setLoading(true);
        try {
            const data = await bannerService.getAll(false);
            setBanners(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (event) => {
        setForm((current) => ({
            ...current,
            imageFile: event.target.files?.[0] || null,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            ...form,
            displayOrder: Number(form.displayOrder || 0),
        };

        if (editingId) {
            await bannerService.update(editingId, { ...payload, id: editingId });
        } else {
            await bannerService.create(payload);
        }

        resetForm();
        loadBanners();
    };

    const handleEdit = (banner) => {
        setEditingId(banner.id);
        setForm({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            imageUrl: banner.imageUrl || '',
            imageFile: null,
            linkUrl: banner.linkUrl || '',
            position: banner.position || 'Home',
            displayOrder: banner.displayOrder || 0,
            isActive: Boolean(banner.isActive),
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa banner này?')) return;
        await bannerService.remove(id);
        loadBanners();
    };

    return (
        <div className="banner-admin-page">
            <Header />
            <main className="banner-admin">
                <div className="container">
                    <div className="banner-admin__head">
                        <div>
                            <h1>Quản lý Banner</h1>
                            <p>Thêm, sửa, xóa và bật tắt banner hiển thị ngoài website.</p>
                        </div>
                        <span>{banners.length} banner</span>
                    </div>

                    <div className="banner-admin__grid">
                        <form className="banner-form" onSubmit={handleSubmit}>
                            <h2>{editingId ? 'Sửa banner' : 'Thêm banner'}</h2>

                            <label>Tiêu đề</label>
                            <input name="title" value={form.title} onChange={handleChange} required />

                            <label>Mô tả ngắn</label>
                            <input name="subtitle" value={form.subtitle} onChange={handleChange} />

                            <label>Link ảnh</label>
                            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />

                            <label>Chọn ảnh từ máy</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {form.imageFile && <small className="banner-file-name">{form.imageFile.name}</small>}

                            <label>Link khi bấm banner</label>
                            <input name="linkUrl" value={form.linkUrl} onChange={handleChange} placeholder="/shop" />

                            <div className="banner-form__row">
                                <div>
                                    <label>Vị trí</label>
                                    <input name="position" value={form.position} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Thứ tự</label>
                                    <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} />
                                </div>
                            </div>

                            <label className="banner-check">
                                <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
                                Hiển thị banner
                            </label>

                            <div className="banner-form__actions">
                                <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
                                {editingId && <button type="button" className="secondary" onClick={resetForm}>Hủy</button>}
                            </div>
                        </form>

                        <div className="banner-list">
                            {loading ? (
                                <div className="banner-empty">Đang tải...</div>
                            ) : banners.length === 0 ? (
                                <div className="banner-empty">Chưa có banner.</div>
                            ) : (
                                banners.map((banner) => (
                                    <article className="banner-card" key={banner.id}>
                                        <img src={getImageUrl(banner.imageUrl, 'https://placehold.co/380x210/eef2f7/667085?text=Banner')} alt={banner.title} />
                                        <div>
                                            <div className="banner-card__top">
                                                <h3>{banner.title}</h3>
                                                <span className={banner.isActive ? 'active' : ''}>
                                                    {banner.isActive ? 'Bật' : 'Tắt'}
                                                </span>
                                            </div>
                                            <p>{banner.subtitle || 'Không có mô tả'}</p>
                                            <small>{banner.position} | Thứ tự {banner.displayOrder}</small>
                                            <div className="banner-card__actions">
                                                <button onClick={() => handleEdit(banner)}>Sửa</button>
                                                <button className="danger" onClick={() => handleDelete(banner.id)}>Xóa</button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default BannerManagement;
