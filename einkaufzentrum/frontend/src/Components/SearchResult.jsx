import React, { useState, useEffect } from 'react';
import '../Style/SearchResult.css';
import ProductCard from './ProductCard';
import '../Style/ProductExplore.css';
import Footer from './Footer';
import { useSearchParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap/FormRange';

const dummyProducts = [
  {
    id: 'dummy1',
    title: 'Sample Product',
    description: 'This is a sample product description. The product is in excellent condition and ready for purchase.',
    price: 299.99,
    image_url: 'https://source.unsplash.com/random/400x300?electronics',
    condition: 'new',
    category: 'Electronics'
  },
  {
    id: 'dummy2',
    title: 'Test Item',
    description: 'A high-quality test item available for immediate purchase. Great value for money!',
    price: 149.99,
    image_url: 'https://source.unsplash.com/random/400x300?gadget',
    condition: 'used',
    category: 'Gadgets'
  }
];

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [condition, setCondition] = useState('all');
  const [color, setColor] = useState('all');

  const searchQuery = searchParams.get('q') || '';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(dummyProducts);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${backendUrl}/api/items?search=${encodeURIComponent(searchQuery)}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch search results: ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format from server');
        }

        const normalized = data.map(item => ({
          ...item,
          id: item._id || item.id,
          title: item.name || item.title,
          description: item.description || 'No description available',
          price: item.price || 0,
          image_url: item.media_url || item.image || 
            `https://source.unsplash.com/random/400x300?product`
        }));
        
        // Add dummy products if no results found
        setSearchResults(normalized.length > 0 ? normalized : dummyProducts);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
        // Show dummy products on error
        setSearchResults(dummyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, backendUrl]);

  const handlePriceChange = (value, bound) => {
    if (bound === 'min') {
      setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
    }
  };

  const applyFilters = () => {
    // Add filter logic here
    setShowFilter(false);
  };

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setCondition('all');
    setColor('all');
  };

  return (
    <div className="page-container">
      <div className="search-results-container">
        <div className="search-header">
          <h2 className="results-title">Search Results</h2>
          {loading ? (
            <p className="results-count">Searching...</p>
          ) : error ? (
            <p className="results-count error">
              Error: {error}. Showing sample products instead.
            </p>
          ) : (
            <p className="results-count">
              {searchResults.length} results {searchResults === dummyProducts ? '(Sample Products)' : `found for "${searchQuery}"`}
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
              <div className="filter-grid">
                {/* Price Range Filter */}
                <div className="filter-group">
                  <h4>Price Range</h4>
                  <div className="price-inputs">
                    <Form.Group className="mb-3">
                      <Form.Label>Min Price: €{priceRange[0]}</Form.Label>
                      <RangeSlider
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(parseInt(e.target.value), 'min')}
                        min={0}
                        max={1000}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Price: €{priceRange[1]}</Form.Label>
                      <RangeSlider
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(parseInt(e.target.value), 'max')}
                        min={0}
                        max={1000}
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Condition Filter */}
                <div className="filter-group">
                  <h4>Condition</h4>
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      label="All"
                      name="condition"
                      checked={condition === 'all'}
                      onChange={() => setCondition('all')}
                    />
                    <Form.Check
                      type="radio"
                      label="New"
                      name="condition"
                      checked={condition === 'new'}
                      onChange={() => setCondition('new')}
                    />
                    <Form.Check
                      type="radio"
                      label="Used"
                      name="condition"
                      checked={condition === 'used'}
                      onChange={() => setCondition('used')}
                    />
                  </Form.Group>
                </div>

                {/* Color Filter */}
                <div className="filter-group">
                  <h4>Color</h4>
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      label="All"
                      name="color"
                      checked={color === 'all'}
                      onChange={() => setColor('all')}
                    />
                    <Form.Check
                      type="radio"
                      label="Dark"
                      name="color"
                      checked={color === 'dark'}
                      onChange={() => setColor('dark')}
                    />
                    <Form.Check
                      type="radio"
                      label="Bright"
                      name="color"
                      checked={color === 'bright'}
                      onChange={() => setColor('bright')}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button 
                className="btn btn-outline-secondary me-2" 
                onClick={resetFilters}
              >
                Reset
              </button>
              <button 
                className="btn btn-primary" 
                onClick={applyFilters}
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