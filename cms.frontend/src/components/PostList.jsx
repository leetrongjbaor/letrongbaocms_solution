import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { getImageUrl } from '../utils/imageHelper';

const PostList = ({ selectedCategoryId, onViewDetail }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return (
        <div className="text-center my-5 py-5">
            <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải tin tức thời trang...</p>
        </div>
    );

    // Lọc bài viết theo danh mục (chuyển đổi ID sang số để khớp chính xác)
    const filteredPosts = selectedCategoryId
        ? posts.filter(item => item.categoryId === Number(selectedCategoryId))
        : posts;

    return (
        <div className="card shadow-sm p-4 border-0" style={{ borderRadius: '16px' }}>
            <style>{`
                /* Tiêu đề chính của danh sách bài viết */
                .blog-section-title {
                    font-weight: 700;
                    color: #212529;
                    letter-spacing: -0.3px;
                }
                
                /* Tấm thẻ bọc ngoài bài viết */
                .post-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.05) !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* Hiệu ứng di chuột vào bài viết */
                .post-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(229, 9, 20, 0.16) !important;
                    border-color: rgba(229, 9, 20, 0.38) !important;
                }
                
                /* Định dạng link tiêu đề bài viết */
                .post-title-link {
                    color: #2d3748;
                    text-decoration: none;
                    transition: color 0.2s ease;
                    font-weight: 600;
                    font-size: 1.15rem;
                }
                
                .post-title-link:hover {
                    color: #ff2d38; /* Màu text-info của Bootstrap */
                    text-decoration: none;
                }
                
                /* Đoạn mô tả ngắn */
                .post-desc {
                    color: #718096;
                    line-height: 1.6;
                    height: 4.8em;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
                
                /* Định dạng ngày tháng */
                .post-date {
                    color: #a0aec0;
                    display: inline-flex;
                    align-items: center;
                    font-size: 0.8rem;
                }
                
                /* Thêm dấu gạch ngang nhỏ trước ngày tháng */
                .post-date::before {
                    content: "—";
                    margin-right: 6px;
                    color: #cbd5e0;
                }

                .post-img-container {
                    height: 180px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                }

                .post-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .post-card:hover .post-img {
                    transform: scale(1.05);
                }

                .post-category-tag {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #ff2d38;
                    background-color: rgba(229, 9, 20, 0.14);
                    padding: 4px 10px;
                    border-radius: 20px;
                }
            `}</style>

            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                <h4 className="mb-0 blog-section-title">
                    <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết
                </h4>
                <span className="badge badge-info rounded-pill px-3 py-2 text-white font-weight-bold" style={{ fontSize: '0.85rem' }}>
                    {filteredPosts.length} bài viết
                </span>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="fa-regular fa-comment-dots text-muted" style={{ fontSize: '3.5rem' }}></i>
                    </div>
                    <h5 className="text-secondary">Chưa có bài viết nào</h5>
                    <p className="text-muted small">Chủ đề bài viết này hiện đang được biên tập. Hãy quay lại sau nhé!</p>
                </div>
            ) : (
                <div className="row">
                    {filteredPosts.map((item) => {
                        const fallbackBlogImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop";
                        const imageUrl = getImageUrl(item.imageUrl, fallbackBlogImage);
                        
                        // Khắc phục lỗi shortDescription bằng cách cắt content từ db
                        const summaryText = item.content 
                            ? (item.content.length > 120 ? item.content.substring(0, 120) + '...' : item.content) 
                            : 'Chưa có nội dung tóm tắt cho bài viết này.';

                        return (
                            <div className="col-md-6 mb-4" key={item.id}>
                                <div className="card h-100 border-0 shadow-sm post-card d-flex flex-column">
                                    <div className="post-img-container">
                                        <img 
                                            src={imageUrl} 
                                            alt={item.title} 
                                            className="post-img"
                                            onError={(e) => { e.target.src = fallbackBlogImage; }}
                                        />
                                    </div>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            {item.categoryName && (
                                                <span className="post-category-tag">
                                                    {item.categoryName}
                                                </span>
                                            )}
                                            <span className="post-date">
                                                {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>

                                        <h5 className="mb-2">
                                            <button 
                                                onClick={() => onViewDetail(item.id)} 
                                                className="btn btn-link p-0 text-left post-title-link text-decoration-none"
                                                style={{ whiteSpace: 'normal', display: 'block' }}
                                            >
                                                {item.title}
                                            </button>
                                        </h5>
                                        
                                        <p className="post-desc small mb-3">{summaryText}</p>
                                        
                                        <div className="mt-auto pt-3 border-top d-flex justify-content-end">
                                            <button 
                                                onClick={() => onViewDetail(item.id)}
                                                className="btn btn-outline-info btn-sm rounded-pill px-3 py-2 fw-semibold"
                                            >
                                                Đọc bài viết <i className="fa-solid fa-book-open ml-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PostList;
