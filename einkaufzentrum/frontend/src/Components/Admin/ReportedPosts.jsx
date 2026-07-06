import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportedPosts = () => {
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportedItems();
  }, []);

  const fetchReportedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/items/reported');
      setReportedItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch reported listings.');
      setLoading(false);
    }
  };

  const handleDismiss = async (itemId) => {
    try {
      await axios.post(`/api/admin/items/dismiss-reports/${itemId}`);
      alert('Reports dismissed successfully!');
      fetchReportedItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to dismiss reports.');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      await axios.post(`/api/admin/items/reject/${itemId}`, { reason: 'Reported as scam / spam' });
      alert('Listing deleted successfully!');
      fetchReportedItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete listing.');
    }
  };

  if (loading) return <div className="container my-4 text-center">Loading reported posts...</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Reported Listings & Moderation</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {reportedItems.length === 0 ? (
        <div className="alert alert-success">No reported listings found. Platform is clean!</div>
      ) : (
        <div className="row">
          {reportedItems.map((item) => (
            <div key={item.item_id} className="col-12 mb-4">
              <div className="card border-danger shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3 d-flex align-items-center bg-light">
                    <img
                      src={item.media_url || 'https://via.placeholder.com/200'}
                      alt={item.title}
                      className="img-fluid rounded-start mx-auto d-block"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body">
                      <h4 className="card-title text-danger">{item.title}</h4>
                      <p className="card-text text-muted mb-2">{item.description}</p>
                      <div className="mb-2">
                        <span className="badge bg-secondary me-2">Category: {item.category_name}</span>
                        <span className="badge bg-dark">Price: €{item.price.toFixed(2)}</span>
                      </div>
                      <p className="small mb-1"><strong>Seller ID:</strong> {item.seller_id} ({item.seller_name})</p>
                      
                      <div className="mt-3 p-3 bg-light rounded border-start border-danger border-4">
                        <h5>Reports Summary ({item.reports.length})</h5>
                        <ul className="list-unstyled mb-0">
                          {item.reports.map((report, idx) => (
                            <li key={report.report_id} className="border-bottom py-2 last-border-none">
                              <span className="badge bg-warning text-dark me-2">Reason</span>
                              <span>{report.reason}</span>
                              <div className="text-muted small mt-1">
                                Reported by user #{report.reporter_id} ({report.reporter_name}) on {new Date(report.timestamp).toLocaleString()}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex flex-column justify-content-center p-3 border-start">
                    <button
                      className="btn btn-outline-success mb-2 w-100"
                      onClick={() => handleDismiss(item.item_id)}
                    >
                      Dismiss Reports
                    </button>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => handleDelete(item.item_id)}
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedPosts;
