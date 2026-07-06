import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostsPendingApproval = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/items/pending')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch pending advertisements.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container my-4 text-center">Loading pending items...</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Posts Pending Approval</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {posts.length === 0 ? (
        <div className="alert alert-success">No posts pending approval! All listings have been reviewed.</div>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.item_id} className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <img 
                  src={post.media_url || 'https://via.placeholder.com/150'} 
                  alt={post.title} 
                  className="card-img-top" 
                  style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text-muted mb-1">Seller: {post.seller_name}</p>
                  <p className="card-text"><strong>Price:</strong> €{post.price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary mt-auto w-100"
                    onClick={() => navigate(`/dashboard/post-approval/${post.item_id}`)}
                  >
                    Review listing
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPendingApproval;