import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: Fetch user details by userId from API
    setUser({
      id: userId,
      name: 'User XYZ',
      memberSince: '2023-01-01',
      totalPosts: 13,
      scamPosts: 7,
      avatar: 'https://via.placeholder.com/150',
    });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  const handleBan = () => {
    // TODO: API call to ban user temporarily
    alert(`User ${user.name} banned.`);
    navigate('/dashboard/reported-users');
  };

  const handleDelete = () => {
    // TODO: API call to delete user permanently
    alert(`User ${user.name} deleted.`);
    navigate('/dashboard/reported-users');
  };

  return (
    <div className="container my-4">
      <h2>User {user.name} Report Details</h2>
      <img src={user.avatar} alt={user.name} className="rounded-circle mb-3" />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Member since:</strong> {user.memberSince}</p>
      <p><strong>Total posts:</strong> {user.totalPosts}</p>
      <p><strong>Posts marked as scam:</strong> {user.scamPosts}</p>

      <button className="btn btn-danger me-2" onClick={handleDelete}>Delete User</button>
      <button className="btn btn-warning" onClick={handleBan}>Ban User</button>
    </div>
  );
};

export default UserDetail;