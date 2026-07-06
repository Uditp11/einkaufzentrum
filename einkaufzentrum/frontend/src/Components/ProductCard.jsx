import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../Style/ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Modal states
  const [showDetail, setShowDetail] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('Offline');
  const [buyMessage, setBuyMessage] = useState('');
  const [reportReason, setReportReason] = useState('');

  // Status/feedback states
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState(null);
  const [isError, setIsError] = useState(false);
  const [localStatus, setLocalStatus] = useState(product?.status || 'Approved');

  if (!product) {
    return <div className="product-card">No product data available</div>;
  }

  const handleOpenBuy = () => {
    if (!user) {
      alert('Please log in to purchase items.');
      navigate('/login');
      return;
    }
    setShowBuy(true);
  };

  const handleOpenReport = () => {
    if (!user) {
      alert('Please log in to report listings.');
      navigate('/login');
      return;
    }
    setShowReport(true);
  };

  const handleConfirmBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    setStatusText(null);

    try {
      const response = await axios.post(`/api/items/buy/${product.item_id || product.id}`, {
        payment_method: paymentMethod,
        message: buyMessage
      });
      setIsError(false);
      setStatusText(response.data.message || 'Purchase request sent successfully!');
      setLocalStatus('Sold');
      setLoading(false);
      setTimeout(() => {
        setShowBuy(false);
        setShowDetail(false);
        setStatusText(null);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setIsError(true);
      setStatusText(err.response?.data?.error || 'Failed to finalize purchase request.');
    }
  };

  const handleConfirmReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      alert('Please provide a reason.');
      return;
    }
    setLoading(true);
    setIsError(false);
    setStatusText(null);

    try {
      const response = await axios.post(`/api/items/report/${product.item_id || product.id}`, {
        reason: reportReason
      });
      setIsError(false);
      setStatusText(response.data.message || 'Report submitted successfully!');
      setLoading(false);
      setTimeout(() => {
        setShowReport(false);
        setStatusText(null);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setIsError(true);
      setStatusText(err.response?.data?.error || 'Failed to submit report.');
    }
  };

  return (
    <>
      <div className="product-card card h-100 shadow-sm border-0">
        <div className="product-image position-relative" style={{ height: '220px', backgroundColor: '#f8f9fa' }}>
          <img 
            src={product.image_url || product.media_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400"} 
            alt={product.title || "Product Image"}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          {localStatus === 'Sold' && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2">SOLD</span>
          )}
        </div>
        <div className="product-content card-body d-flex flex-column">
          <h3 className="product-title h5 text-truncate">{product.title || "No Title"}</h3>
          <p className="product-description text-muted small text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description || "No description available."}
          </p>
          <p className="product-price fw-bold text-primary mb-3">€{product.price?.toFixed(2) || "N/A"}</p>
          <div className="product-actions mt-auto d-flex gap-2">
            <button 
              className="btn btn-primary buy-btn flex-grow-1" 
              onClick={handleOpenBuy}
              disabled={localStatus === 'Sold'}
            >
              {localStatus === 'Sold' ? 'Sold' : 'Buy Now'}
            </button>
            <button 
              className="btn btn-outline-secondary view-btn flex-grow-1" 
              onClick={() => setShowDetail(true)}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* 1. Main Details Modal */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{product.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-5 text-center mb-3">
              <img 
                src={product.image_url || product.media_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400"} 
                alt={product.title} 
                className="img-fluid rounded" 
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
            <div className="col-md-7">
              <h4>€{product.price?.toFixed(2)}</h4>
              <p className="badge bg-secondary mb-3">{product.category_name || product.category || 'Listing'}</p>
              
              <div className="bg-light p-3 rounded mb-3">
                <h5>Description</h5>
                <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
              </div>

              <div className="text-muted small mb-4">
                <p className="mb-1">Seller Reference ID: {product.seller_id}</p>
                <p className="mb-0">Listing Status: {localStatus}</p>
              </div>

              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleOpenBuy} 
                  disabled={localStatus === 'Sold'}
                  className="flex-grow-1"
                >
                  {localStatus === 'Sold' ? 'Sold' : 'Purchase / Contact'}
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={handleOpenReport}
                  className="flex-grow-1"
                >
                  Report Scam
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* 2. Buy / Checkout Modal */}
      <Modal show={showBuy} onHide={() => setShowBuy(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase Request</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleConfirmBuy}>
          <Modal.Body>
            {statusText && (
              <Alert variant={isError ? 'danger' : 'success'}>
                {statusText}
              </Alert>
            )}
            <p>You are buying: <strong>{product.title}</strong> for <strong>€{product.price?.toFixed(2)}</strong>.</p>
            
            <Form.Group className="mb-3">
              <Form.Label>Payment Method Choice</Form.Label>
              <Form.Select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Offline">Offline Meetup (Cash Handover)</option>
                <option value="Online">Online Bank Transfer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message for Seller</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Let the seller know when you can meet or ask for details..."
                value={buyMessage}
                onChange={(e) => setBuyMessage(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBuy(false)}>Cancel</Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* 3. Report Scam Modal */}
      <Modal show={showReport} onHide={() => setShowReport(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Report Listing</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleConfirmReport}>
          <Modal.Body>
            {statusText && (
              <Alert variant={isError ? 'danger' : 'success'}>
                {statusText}
              </Alert>
            )}
            <p className="text-muted small">Help us keep Einkaufzentrum safe. Please specify why you are reporting this ad.</p>
            
            <Form.Group className="mb-3">
              <Form.Label>Reason for Report</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Spam description, fake pricing, phishing external link..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReport(false)}>Cancel</Button>
            <Button variant="danger" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductCard;