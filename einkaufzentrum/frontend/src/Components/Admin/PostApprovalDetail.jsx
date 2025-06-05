import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostApprovalDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    // TODO: Fetch post details by postId from API
    setPost({
      id: postId,
      title: `Product ${postId}`,
      image: 'https://via.placeholder.com/400',
      description: 'Detailed description of the product...',
      seller: 'Seller Name',
    });
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  const handleApprove = () => {
    // TODO: API call to approve post
    alert('Post approved!');
    navigate('/dashboard/posts-awaiting-approval');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    // TODO: API call to reject post with reason
    alert(`Post rejected with reason: ${rejectReason}`);
    navigate('/dashboard/posts-awaiting-approval');
  };

  return (
    <div className="container my-4">
      <h2>{post.title} Review & Approval</h2>
      <img src={post.image} alt={post.title} className="img-fluid mb-3" />
      <p>{post.description}</p>
      <p><strong>Seller:</strong> {post.seller}</p>

      <button className="btn btn-success me-2" onClick={handleApprove}>Approve</button>
      <button className="btn btn-danger" onClick={handleReject}>Reject</button>

      <div className="mt-3">
        <label>If Reject, specify reason:</label>
        <textarea
          className="form-control"
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          rows={3}
          placeholder="Reason for rejection..."
        />
      </div>
    </div>
  );
};

export default PostApprovalDetail;