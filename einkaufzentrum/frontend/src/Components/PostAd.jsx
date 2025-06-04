import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../Style/PostAd.css';

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // Backend server URL

const PostAd = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category_id: ''
    });

    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const { user } = useAuth(); // user contains userId, token, etc.

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
            let imageUrl = '';

            // Uploading image to S3 and getting the URL to post api and store in the database
            if (imageFile) {
            const imageData = new FormData();
            imageData.append('image', imageFile);

            const uploadRes = await axios.post('/api/upload/image', imageData);

            imageUrl = uploadRes.data.image_url;
            }

            const seller_id = user?.userId || 0;

            const postData = {
            ...formData,
            price: parseFloat(formData.price),
            category_id: parseInt(formData.category_id),
            seller_id: seller_id,
            media_url: imageUrl
            };

            const response = await axios.post('/api/items/add', postData, {
            headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
            setSuccess(true);
            setFormData({ title: '', description: '', price: '', category_id: '' });
            setImageFile(null);

            setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to post advertisement.');
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

                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
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