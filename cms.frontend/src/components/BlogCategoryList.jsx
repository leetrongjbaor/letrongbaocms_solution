import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = ({ activeId, onSelectCategory }) => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi API chuyên mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogCategories();
    }, []); // ← Không được bỏ []

    if (loading) return <p className="text-muted small text-center py-3">Đang nạp chuyên mục...</p>;

    return (
        <div className="card shadow-sm border-0 rounded-lg mt-4">
            <style>{`
                .custom-category-item {
                    transition: all 0.25s ease-in-out !important;
                    border-left: 3px solid transparent !important;
                    font-weight: 500;
                }
                
                /* Trạng thái Hover HOẶC trạng thái Active (Đang được chọn) */
                .custom-category-item:hover,
                .custom-category-item.is-active {
                    background-color: rgba(229, 9, 20, 0.12) !important; /* Màu nền xanh lam siêu nhẹ */
                    color: #ff2d38 !important;
                    padding-left: 1.75rem !important;
                    border-left-color: #e50914 !important;
                }
                
                .custom-category-item:hover .fa-chevron-right,
                .custom-category-item.is-active .fa-chevron-right {
                    transform: translateX(3px);
                    color: #ff2d38 !important;
                    opacity: 1 !important;
                }
                
                .fa-chevron-right {
                    transition: all 0.2s ease;
                }
                .mr-2 {
                    margin-right: 0.5rem !important;
                }
            `}</style>

            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-hashtag text-info mr-2" style={{ fontSize: '1.2rem' }}></i> Chủ đề bài viết
                </h5>
            </div>

            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {/* Nút tất cả chủ đề */}
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 custom-category-item ${activeId === '' ? 'is-active' : ''}`}
                        style={{ fontSize: '0.95rem', color: '#495057' }}
                        onClick={() => onSelectCategory('')}
                    >
                        <span className={activeId === '' ? "fw-bold" : "font-weight-normal"}>
                            Tất cả chủ đề
                        </span>
                        <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                    </button>

                    {blogCategories.length === 0 ? (
                        <div className="p-3 text-center text-muted small">Chưa có chủ đề nào.</div>
                    ) : (
                        blogCategories.map((cate) => (
                            <button
                                key={cate.id}
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 custom-category-item ${activeId === cate.id ? 'is-active' : ''}`}
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                                onClick={() => onSelectCategory(cate.id)}
                            >
                                <span className={activeId === cate.id ? "fw-bold" : "font-weight-normal"}>
                                    #{cate.name}
                                </span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCategoryList;
