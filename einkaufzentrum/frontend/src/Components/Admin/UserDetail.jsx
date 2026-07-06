import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/admin/users/reported/${userId}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch reported user details.');
        setLoading(false);
      });
  }, [userId]);

  const handleBan = async () => {
    if (!window.confirm(`Are you sure you want to ban ${user.name}? This will hide all their ads.`)) return;
    try {
      await axios.post(`/api/admin/users/ban/${userId}`);
      alert(`User ${user.name} banned successfully.`);
      navigate('/dashboard/reported-users');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to ban user.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Are you sure you want to delete user ${user.name} permanently? This deletes all their listings, reports, and messages.`)) return;
    try {
      await axios.delete(`/api/admin/users/delete/${userId}`);
      alert(`User ${user.name} permanently deleted.`);
      navigate('/dashboard/reported-users');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  if (loading) return <div className="container my-4 text-center">Loading user details...</div>;
  if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
  if (!user) return <div className="container my-4 alert alert-warning">User not found.</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Report Details: {user.name}</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/reported-users')}>
          Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4 text-center">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`} 
              alt={user.name} 
              className="rounded-circle mb-3 mx-auto" 
              style={{ width: '120px', height: '120px', backgroundColor: '#f8f9fa' }}
            />
            <h4>{user.name}</h4>
            <p className="text-muted small">{user.email}</p>
            <hr />
            <div className="text-start mb-4">
              <p className="mb-1"><strong>Status:</strong> <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{user.status}</span></p>
              <p className="mb-1"><strong>Member since:</strong> {user.memberSince}</p>
              <p className="mb-1"><strong>Total ads posted:</strong> {user.totalPosts}</p>
              <p className="mb-0"><strong>Ads flagged as scam:</strong> {user.scamPosts}</p>
            </div>
            
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn btn-warning text-dark fw-bold" 
                onClick={handleBan}
                disabled={user.status === 'Banned'}
              >
                {user.status === 'Banned' ? 'Already Banned' : 'Ban User Account'}
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete User Permanently</button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3 text-danger">Active Reports on this User</h4>
            
            {user.reports.length === 0 ? (
              <div className="alert alert-info">No active report detail records found.</div>
            ) : (
              <div className="list-group">
                {user.reports.map((report) => (
                  <div key={report.report_id} className="list-group-item list-group-item-action flex-column align-items-start py-3 mb-2 border rounded">
                    <div className="d-flex w-100 justify-content-between mb-2">
                      <h5 className="mb-1 text-primary">Report #{report.report_id}</h5>
                      <small className="text-muted">{new Date(report.timestamp).toLocaleString()}</small>
                    </div>
                    <p className="mb-2 fw-semibold">" {report.reason} "</p>
                    <small className="text-muted">Reported by User ID: {report.reporter_id} ({report.reporter_name})</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;