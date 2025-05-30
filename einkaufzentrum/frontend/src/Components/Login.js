import React from 'react';
import '../Style/Login.css';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="login-page">
    
      <section className="login-section">
        <Container className="text-center">
          <h2 className="section-title">LOGIN</h2>
          <div className="login-box mx-auto p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="User ID or Email" />
              </Form.Group>
              <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                <Form.Control type="password" placeholder="Passkey" />
              </Form.Group>
                <p className='forgot'>
                    <small><Link to="/forgot" className="text-info">Forgot PassKey?</Link></small>
                </p>
              <Button variant="primary" type="submit" className="w-100">Submit</Button>
            </Form>
            <p className="mt-4">
              New User? <Link to="/register" className="text-info">Register here</Link>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default LoginPage;
