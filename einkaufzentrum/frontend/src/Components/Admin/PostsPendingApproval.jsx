import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostsPendingApproval = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch posts pending approval from API
    setPosts([
      { id: 1, title: 'Product 1', seller: 'Seller A' },
      { id: 2, title: 'Product 2', seller: 'Seller B' },
      // dummy data
    ]);
  }, []);

  return (
    <div className="container my-4">
      <h2>Posts Pending Approval</h2>
      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">Seller: {post.seller}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => navigate(`/dashboard/post-approval/${post.id}`)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPendingApproval;