import React from 'react';
import '../Style/ProductCard.css';

const ProductCard = ({ product }) => {
  if (!product) {
    return <div className="product-card">No product data available</div>;
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.media_url || product.image || "https://source.unsplash.com/random/400x300?product"} 
          alt={product.title || "Product Image"} 
        />
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.title || product.name || "No Title"}</h3>
        <p className="product-description">{product.description || "No description available."}</p>
        <p>Price: ${product.price?.toFixed(2) || "N/A"}</p>
        <div className="product-actions">
          <button className="btn buy-btn">Buy Now</button>
          <button className="btn view-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;