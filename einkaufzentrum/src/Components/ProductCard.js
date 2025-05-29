import React from 'react'
import '../Style/ProductCard.css';

const ProductCard = () => {
    return (
        <div className="product-card">
            <div className="product-image">
                <img src="https://source.unsplash.com/random/400x300?product" alt="Product Image"/>
            </div>
            <div className="product-content">
                <h3 className="product-title">Wireless Noise-Canceling Headphones</h3>
                <p className="product-description">Premium sound quality with 40hr battery life. Touch controls & premium comfort.</p>
                <p>Price : 200$</p>
                <div className="product-actions">
                    <button className="btn buy-btn">Buy Now</button>
                    <button className="btn view-btn">View Details</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard