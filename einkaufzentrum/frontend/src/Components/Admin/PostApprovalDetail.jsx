import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostApprovalDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/admin/items/pending/${postId}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch pending post details.');
        setLoading(false);
      });
  }, [postId]);

  const handleApprove = async () => {
    try {
      await axios.post(`/api/admin/items/approve/${postId}`);
      alert('Post approved successfully!');
      navigate('/dashboard/posts-awaiting-approval');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve post.');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    try {
      await axios.post(`/api/admin/items/reject/${postId}`, { reason: rejectReason });
      alert(`Post rejected and deleted. Reason: ${rejectReason}`);
      navigate('/dashboard/posts-awaiting-approval');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject post.');
    }
  };

  if (loading) return <div className="container my-4 text-center">Loading post details...</div>;
  if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
  if (!post) return <div className="container my-4 alert alert-warning">Post not found.</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Review Posting: {post.title}</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/posts-awaiting-approval')}>
          Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-2 bg-light">
            <img 
              src={post.media_url || 'https://via.placeholder.com/400'} 
              alt={post.title} 
              className="img-fluid rounded" 
              style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3">{post.title}</h3>
            <p className="lead text-primary fw-bold">Price: €{post.price.toFixed(2)}</p>
            
            <div className="mb-3 bg-light p-3 rounded">
              <h5>Product Description</h5>
              <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{post.description}</p>
            </div>

            <div className="mb-4">
              <p className="mb-1"><strong>Seller:</strong> {post.seller_name} (ID: {post.seller_id})</p>
              <p className="mb-1"><strong>Date Posted:</strong> {post.date_posted ? new Date(post.date_posted).toLocaleString() : 'N/A'}</p>
              <p className="mb-0"><strong>Status:</strong> <span className="badge bg-warning text-dark">{post.status}</span></p>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button className="btn btn-success flex-grow-1" onClick={handleApprove}>Approve & Publish</button>
              <button className="btn btn-danger flex-grow-1" onClick={handleReject}>Reject & Delete</button>
            </div>

            <div className="bg-light p-3 rounded">
              <label className="form-label fw-bold">Rejection Reason</label>
              <textarea
                className="form-control"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Specify reason if rejecting this listing..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostApprovalDetail;