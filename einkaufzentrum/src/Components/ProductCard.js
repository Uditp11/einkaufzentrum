import React from 'react';
import '../Style/ProductCard.css';

const ProductCard = ({ product }) => {
    const { title, price, description, image, condition } = product;

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={image} alt={title} />
                <span className="condition-badge">{condition}</span>
            </div>
            <div className="product-info">
                <h3 className="product-title">{title}</h3>
                <p className="product-description">{description}</p>
                <div className="product-price">${price.toFixed(2)}</div>
                <button className="view-details-btn">View Details</button>
            </div>
        </div>
    );
};

export default ProductCard; 