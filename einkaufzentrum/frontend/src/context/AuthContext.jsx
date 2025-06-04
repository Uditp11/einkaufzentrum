import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Verify token with backend
            verifyToken(token).then(isValid => {
                if (isValid) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // If token is invalid, clear everything
                    logout();
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await axios.post(`${API_URL}/api/users/verify-token`, { token });
            return response.status === 200;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default authorization header for all future requests
        if (userData.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Remove authorization header
        delete axios.defaults.headers.common['Authorization'];
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 