import React, { useState, useEffect } from 'react'
import '../Style/ProductExplore.css'
import ProductCard from './ProductCard'
import Footer from './Footer';

const ProductExplore = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('http://localhost:3001/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="explore">Loading products...</div>;
    }

    if (error) {
        return <div className="explore">Error: {error}</div>;
    }

    return (
        <div>
            <div className='explore'>
                <div>
                    <h2 className="section-title">Products you may like</h2>
                </div>

                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProductExplore