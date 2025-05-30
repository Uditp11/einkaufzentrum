import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../Style/ProductExplore.css';
import Footer from './Footer';

const ProductExplore = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
                // Temporary: Set dummy data for development
                setProducts([
                    {
                        id: 1,
                        title: "Laptop Acer",
                        price: 499.99,
                        description: "Powerful laptop for everyday use",
                        image: "https://via.placeholder.com/300",
                        condition: "New"
                    },
                    {
                        id: 2,
                        title: "MacBook Pro",
                        price: 1299.99,
                        description: "High-end laptop for professionals",
                        image: "https://via.placeholder.com/300",
                        condition: "Used"
                    },
                    {
                        id: 3,
                        title: "Dell XPS",
                        price: 899.99,
                        description: "Premium ultrabook with 4K display",
                        image: "https://via.placeholder.com/300",
                        condition: "New"
                    },
                    {
                        id: 4,
                        title: "HP Pavilion",
                        price: 649.99,
                        description: "Great value multimedia laptop",
                        image: "https://via.placeholder.com/300",
                        condition: "Used"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <div className="explore-container">
                <h1 className="explore-title">Explore Products</h1>
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductExplore; 