import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostDetail from '../../components/PostDetail';

function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <PostDetail postId={id} onBack={() => navigate('/')} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default BlogDetail;
