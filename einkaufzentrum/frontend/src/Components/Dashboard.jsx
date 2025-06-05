import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    postsAwaitingApproval: 0,
    usersReportedAsScam: 0,
    postsMarkedAsScam: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard-counts')
      .then(res => res.json())
      .then(data => {
        setCounts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="container my-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row gy-4">
        {/* Posts Awaiting Approval */}
        <div className="col-md-4">
          <div className="card border-primary h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Posts Awaiting Approval</h5>
              <p className="display-4">{counts.postsAwaitingApproval}</p>
              <button 
                className="btn btn-primary mt-auto"
                onClick={() => navigate('/dashboard/posts-awaiting-approval')}
              >
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Users Reported as Scam */}
        <div className="col-md-4">
          <div className="card border-warning h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Users Reported as Scam</h5>
              <p className="display-4">{counts.usersReportedAsScam}</p>
              <button 
                className="btn btn-warning mt-auto"
                onClick={() => navigate('/dashboard/reported-users')}
              >
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Posts Marked as Scam */}
        <div className="col-md-4">
          <div className="card border-danger h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Posts Marked as Scam</h5>
              <p className="display-4">{counts.postsMarkedAsScam}</p>
              <button 
                className="btn btn-danger mt-auto"
                onClick={() => navigate('/dashboard/posts-marked-scam')}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;