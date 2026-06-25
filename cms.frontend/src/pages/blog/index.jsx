import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostList from '../../components/PostList';
import BlogCategoryList from '../../components/BlogCategoryList';

function Blog() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <BlogCategoryList 
                                activeId={selectedCategoryId} 
                                onSelectCategory={setSelectedCategoryId} 
                            />
                        </div>
                        <div className="col-md-9">
                            <PostList 
                                selectedCategoryId={selectedCategoryId} 
                                onViewDetail={(id) => navigate(`/blog/${id}`)} 
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Blog;
