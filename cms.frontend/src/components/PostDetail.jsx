import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostDetail = ({ postId, onBack }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostDetail(postId);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostDetail();
        }
    }, [postId]);

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-info blog-spinner" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center my-5 py-5 bg-white rounded-lg shadow-sm blog-not-found-container">
                <i className="fa-solid fa-file-excel text-danger mb-3 blog-error-icon"></i>
                <h5 className="text-secondary fw-semibold">Không tìm thấy bài viết</h5>
                <p className="text-muted small">Bài viết này có thể đã bị gỡ bỏ hoặc liên kết bị lỗi.</p>
                <button onClick={onBack} className="btn btn-info text-white rounded-pill px-4 mt-3">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại tin tức
                </button>
            </div>
        );
    }

    const fallbackBlogImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop";
    const imageUrl = post.imageUrl && post.imageUrl.trim() !== "" ? post.imageUrl : fallbackBlogImage;

    return (
        <div className="bg-white p-4 p-md-5 shadow-sm mx-auto blog-detail-wrapper">
            {/* Gom toàn bộ CSS của file vào đây */}
            <style>{`
                .blog-detail-wrapper {
                    border-radius: 16px;
                    max-width: 850px;
                }
                .blog-back-btn {
                    color: #64748b;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: all 0.2s;
                }
                .blog-back-btn:hover {
                    color: #0dcaf0;
                    transform: translateX(-4px);
                }
                .blog-cover-wrapper {
                    height: 380px;
                    border-radius: 20px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                }
                .blog-cover-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .blog-title-large {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.3;
                    letter-spacing: -0.5px;
                }
                .blog-meta-info {
                    font-size: 0.85rem;
                    color: #64748b;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 20px;
                    gap: 15px;
                }
                .blog-body-text {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #334155;
                    white-space: pre-line;
                }
                .blog-badge-small {
                    font-size: 0.7rem;
                }
                .blog-spinner {
                    width: 3.5rem;
                    height: 3.5rem;
                }
                .blog-not-found-container {
                    border-radius: 16px;
                }
                .blog-error-icon {
                    font-size: 3.5rem;
                }
            `}</style>

            {/* Back Button */}
            <div className="mb-4 d-inline-block">
                <button onClick={onBack} className="btn btn-link p-0 blog-back-btn d-flex align-items-center">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại tin tức
                </button>
            </div>

            <article>
                {/* Header Meta */}
                <div className="mb-4">
                    {post.category?.name && (
                        <span className="badge badge-info text-white px-3 py-2 rounded-pill font-weight-bold text-uppercase mb-3 blog-badge-small">
                            {post.category.name}
                        </span>
                    )}
                    {post.categoryName && !post.category?.name && (
                        <span className="badge badge-info text-white px-3 py-2 rounded-pill font-weight-bold text-uppercase mb-3 blog-badge-small">
                            {post.categoryName}
                        </span>
                    )}
                    <h1 className="blog-title-large mb-3">
                        {post.title}
                    </h1>

                    <div className="blog-meta-info d-flex align-items-center flex-wrap">
                        <span>
                            <i className="fa-solid fa-calendar-days text-info mr-1"></i>
                            Ngày đăng: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span>•</span>
                        <span>
                            <i className="fa-solid fa-user-pen text-info mr-1"></i>
                            Biên tập: Ban biên tập Fashion Boutique
                        </span>
                    </div>
                </div>

                {/* Banner Image */}
                <div className="blog-cover-wrapper mb-4">
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="blog-cover-img"
                        onError={(e) => { e.target.src = fallbackBlogImage; }}
                    />
                </div>

                {/* Body Text Content */}
                <div className="blog-body-text px-lg-2">
                    {post.content || "Chưa có nội dung chi tiết cho bài viết này."}
                </div>
            </article>
        </div>
    );
};

export default PostDetail;