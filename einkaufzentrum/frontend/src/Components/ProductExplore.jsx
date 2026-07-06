import React, { useState, useEffect } from 'react'
import '../Style/ProductExplore.css'
import ProductCard from './ProductCard'
import Footer from './Footer';

const dummyProducts = [
    {
        id: 'explore1',
        title: 'MacBook Pro M2',
        description: 'Latest MacBook Pro with M2 chip, 16GB RAM, and 512GB SSD. Perfect for students and professionals.',
        price: 1299.99,
        media_url: 'https://source.unsplash.com/random/400x300?macbook',
        condition: 'new',
        category: 'Electronics'
    },
    {
        id: 'explore2',
        title: 'iPhone 14 Pro',
        description: 'Brand new iPhone 14 Pro with 256GB storage. Dynamic Island, Pro camera system.',
        price: 999.99,
        media_url: 'https://source.unsplash.com/random/400x300?iphone',
        condition: 'new',
        category: 'Electronics'
    },
    {
        id: 'explore3',
        title: 'Study Desk',
        description: 'Modern study desk with drawer storage. Perfect for your dorm room or apartment.',
        price: 149.99,
        media_url: 'https://source.unsplash.com/random/400x300?desk',
        condition: 'used',
        category: 'Furniture'
    },
    {
        id: 'explore4',
        title: 'Calculus Textbook',
        description: 'Calculus: Early Transcendentals, 8th Edition. Minimal highlighting, great condition.',
        price: 49.99,
        media_url: 'https://source.unsplash.com/random/400x300?book',
        condition: 'used',
        category: 'Books'
    },
    {
        id: 'explore5',
        title: 'Mountain Bike',
        description: 'Trek mountain bike, perfect for campus commuting and weekend adventures.',
        price: 299.99,
        media_url: 'https://source.unsplash.com/random/400x300?bike',
        condition: 'used',
        category: 'Sports'
    },
    {
        id: 'explore6',
        title: 'Gaming Monitor',
        description: '27" 4K Gaming Monitor, 144Hz refresh rate. HDR support and minimal bezels.',
        price: 399.99,
        media_url: 'https://source.unsplash.com/random/400x300?monitor',
        condition: 'new',
        category: 'Electronics'
    }
];

const ProductExplore = () => {
    // Initialize with dummy data
    const [products, setProducts] = useState(dummyProducts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        console.log('ProductExplore component mounted');
        const fetchProducts = async () => {
            console.log('Fetching products...');
            try {
                const response = await fetch(`${backendUrl}/api/items`);
                console.log('API Response:', response);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                
                if (Array.isArray(data) && data.length > 0) {
                    console.log('Valid data received, normalizing...');
                    const normalized = data.map(item => ({
                        id: item.item_id || item._id || item.id,
                        item_id: item.item_id || item._id || item.id,
                        title: item.name || item.title,
                        description: item.description || 'No description available',
                        price: item.price || 0,
                        media_url: item.media_url || item.image_url || item.image || 
                            `https://source.unsplash.com/random/400x300?product`
                    }));
                    setProducts(normalized);
                } else {
                    console.log('No data received or empty array, keeping dummy data');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
                console.log('Error occurred, keeping dummy data');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

    console.log('Current state:', { products, loading, error });

    if (loading) {
        return (
            <div className="explore">
                <div className="loading">
                    <i className="bi bi-arrow-repeat spin"></i>
                    Loading products...
                </div>
            </div>
        );
    }

    // Ensure we always have products to display
    const displayProducts = products.length > 0 ? products : dummyProducts;

    return (
        <div>
            <div className='explore'>
                {error && (
                    <div className="error-message mb-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}. Showing sample products instead.
                    </div>
                )}
                
                <div>
                    <h2 className="section-title">
                        {products === dummyProducts ? 'Sample Products' : 'Products you may like'}
                    </h2>
                </div>

                <div className="products-grid">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductExplore;