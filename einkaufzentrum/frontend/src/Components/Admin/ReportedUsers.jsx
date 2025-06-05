import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportedUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch reported users from API
    setUsers([
      { id: 1, name: 'User One', reports: 3 },
      { id: 2, name: 'User Two', reports: 5 },
    ]);
  }, []);

  return (
    <div className="container my-4">
      <h2>Users Reported as Scam</h2>
      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Reports: {user.reports}</p>
                <button
                  className="btn btn-warning mt-auto"
                  onClick={() => navigate(`/dashboard/reported-users/${user.id}`)}
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

export default ReportedUsers;