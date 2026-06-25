import React, { useEffect, useState } from 'react';
import blogService from '../services/blogService';
import './PostDetail.css';

function PostDetail({ postId, onBack }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        blogService
            .getPostDetail(postId)
            .then((res) => {
                if (isMounted) setPost(res);
            })
            .catch(() => {
                if (isMounted) {
                    setError('Không tải được bài viết. Vui lòng thử lại.');
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [postId]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    if (!post) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                Không tìm thấy bài viết.
            </div>
        );
    }

    return (
        <div className="card shadow-sm post-detail">
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="card-img-top post-detail__cover"
                />
            )}

            <div className="card-body">
                {post.category?.name && (
                    <span className="badge bg-info text-dark mb-2">
                        {post.category.name}
                    </span>
                )}

                <h2 className="card-title text-primary">{post.title}</h2>

                <p className="text-muted small">
                    Ngày đăng:{' '}
                    {post.createdDate
                        ? new Date(post.createdDate).toLocaleDateString('vi-VN')
                        : '—'}
                </p>

                <hr />

                {/* QUAN TRỌNG: dùng dangerouslySetInnerHTML để render đúng HTML do CKEditor tạo ra. */}
                {/* Nếu in trực tiếp {post.content} thì các thẻ <p>, <br>... sẽ hiện thành chữ thô. */}
                <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <button type="button" className="btn btn-secondary mt-3" onClick={onBack}>
                    ← Quay lại
                </button>
            </div>
        </div>
    );
}

export default PostDetail;