import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Style/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Display success message if coming from signup
    const successMessage = location.state?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value.trim()
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
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
            console.log('Sending login request with:', formData);
            const response = await axios.post('/api/users/login', {
                email: formData.email,
                password: formData.password
            });
            
            console.log('Login response:', response);

            if (response.status === 200 && response.data) {
                const { user_id, email, token, full_name } = response.data;
                
                // Store the token in localStorage
                localStorage.setItem('token', token);
                
                // Set default authorization header for all future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Update auth context with user data
                login({
                    userId: user_id,
                    email,
                    fullName: full_name,
                    token
                });

                navigate('/');
            }
        } catch (error) {
            console.error('Login error details:', error.response?.data);
            let errorMessage = 'Failed to login. Please try again.';
            
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = error.response.data.error || 'Invalid email or password';
                        break;
                    case 403:
                        errorMessage = 'Account is not active';
                        break;
                    case 400:
                        errorMessage = 'Missing email or password';
                        break;
                    default:
                        errorMessage = error.response.data.error || 'An error occurred during login';
                }
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4">
                    New User? <Link to="/signup" className="text-info">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
