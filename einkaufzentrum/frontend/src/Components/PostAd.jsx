import React, { useState } from 'react';
import axios from 'axios';
import '../Style/PostAd.css';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000'; // Backend server URL

const PostAd = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category_id: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Get the current user's ID (you'll need to implement user authentication)
            const seller_id = 1; // TODO: Replace with actual user ID from authentication

            // Prepare the data according to backend requirements
            const postData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: parseInt(formData.category_id),
                seller_id: seller_id
            };

            // Send the data to the backend
            const response = await axios.post('/api/items/add', postData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header when you implement authentication
                    // 'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category_id: ''
                });
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error posting ad:', error);
            setError(error.response?.data?.error || 'Failed to post advertisement. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post-ad-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card post-ad-card">
                            <div className="card-header">
                                <h3>Post Your Advertisement</h3>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        Advertisement posted successfully!
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter the title of your ad"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Describe your item in detail"
                                            required
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="price" className="form-label">Price (€)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="Enter price"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="category_id" className="form-label">Category</label>
                                            <select
                                                className="form-select"
                                                id="category_id"
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                <option value="1">Books</option>
                                                <option value="2">Electronics</option>
                                                <option value="3">Furniture</option>
                                                <option value="4">Clothing</option>
                                                <option value="5">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Advertisement'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostAd; 