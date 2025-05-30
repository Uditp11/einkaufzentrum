import React, { useState, useEffect } from 'react';
import '../Style/SearchResult.css';
import ProductCard from './ProductCard';
import '../Style/ProductExplore.css';
import Footer from './Footer';
import { useSearchParams } from 'react-router-dom';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const searchQuery = searchParams.get('q') || '';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${backendUrl}/api/items/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!res.ok) throw new Error('Failed to fetch search results');
        const data = await res.json();

        const normalized = data.map(item => ({
          ...item,
          id: item.item_id,
          image_url: item.media_url || 
            `https://source.unsplash.com/random/400x300?product`
        }));
        setSearchResults(normalized);
      } catch (err) {
        setError(err.message);
        setSearchResults([
          { 
            id: 1, 
            title: "Dummy", 
            price: 0, 
            image_url: "https://source.unsplash.com/random/400x300?product" 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [searchQuery, backendUrl]);

  return (
    <div className="page-container">
      <div className="search-results-container">
        <div className="search-header">
          <h2 className="results-title">Your Search Results</h2>
          {loading ? (
            <p className="results-count">Searching...</p>
          ) : error ? (
            <p className="results-count error">Error: {error}</p>
          ) : (
            <p className="results-count">
              {searchResults.length} results related to "{searchQuery}"
            </p>
          )}

          <div className="search-controls">
            <div className="sort-control">
              <button className="btn btn-outline-primary">
                <i className="bi bi-sort-down"></i>
                Sort
              </button>
            </div>
            <div className="filter-control">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowFilter(!showFilter)}
              >
                <i className="bi bi-funnel"></i>
                Filter
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="filter-section">
            {/* Filter UI unchanged */}
            <div className="filter-header">
              <h3>Filter Options</h3>
              <button
                className="close-filter"
                onClick={() => setShowFilter(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="filter-options">
              {/* Price Range, Condition, Color */}
            </div>

            <div className="filter-actions">
              <button 
                className="btn btn-outline-primary" 
                onClick={() => setShowFilter(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid-container">
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResult;