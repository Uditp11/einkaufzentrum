import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/users/reported')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch reported users.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container my-4 text-center">Loading reported users...</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Reported for Moderation</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length === 0 ? (
        <div className="alert alert-success">No reported users. The community is behaving well!</div>
      ) : (
        <div className="row">
          {users.map(user => (
            <div key={user.id} className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm border-warning">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`} 
                      alt={user.name} 
                      className="rounded-circle me-3" 
                      style={{ width: '50px', height: '50px', backgroundColor: '#e9ecef' }}
                    />
                    <div>
                      <h5 className="card-title mb-0">{user.name}</h5>
                      <span className="small text-muted">{user.email}</span>
                    </div>
                  </div>
                  <p className="card-text">
                    <strong>Reports:</strong> <span className="badge bg-danger">{user.reports} report(s)</span>
                  </p>
                  <p className="card-text">
                    <strong>Account Status:</strong> <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{user.status}</span>
                  </p>
                  <button
                    className="btn btn-warning mt-auto w-100 text-dark fw-bold"
                    onClick={() => navigate(`/dashboard/reported-users/${user.id}`)}
                  >
                    Review user
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

export default ReportedUsers;