import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Style/Login.css'; // We can reuse the login styles

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Remove confirm_password before sending to API
            const { confirm_password, ...signupData } = formData;
            
            const response = await axios.post(`${API_URL}/api/users/signup`, signupData);
            
            if (response.status === 201) {
                // Redirect to login page with success message
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please login with your credentials.' 
                    }
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Create Account</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4">
                    Already have an account? <Link to="/login" className="text-info">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;