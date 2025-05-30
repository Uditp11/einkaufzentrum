import React, { useState, useEffect } from 'react';
import '../Style/SearchResult.css';
import ProductCard from './ProductCard';
import '../Style/ProductExplore.css';
import Footer from './Footer';
import { useSearchParams } from 'react-router-dom';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);
            
            // Temporary: Skip API call and use dummy data
            const dummyData = [
                { id: 1, title: "Laptop Acer", price: 499.99 },
                { id: 2, title: "Laptop Acer 2", price: 299.99 },
                { id: 3, title: "Laptop Acer 3", price: 699.99 },
                { id: 4, title: "Laptop Acer 4", price: 899.99 },
                { id: 5, title: "Laptop Acer 5", price: 1299.99 },
                { id: 6, title: "Laptop Acer 6", price: 799.99 },
            ];
            
           
            setTimeout(() => {
                setSearchResults(dummyData);
                setLoading(false);
            }, 500);

            /* Comment out the API call for now until backend is ready
            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                setError(err.message);
                // Set dummy data on error
                setSearchResults([
                    { id: 1, title: "Laptop Acer", price: 499.99 },
                    { id: 2, title: "Laptop Acer 2", price: 299.99 },
                    { id: 3, title: "Laptop Acer 3", price: 699.99 },
                    { id: 4, title: "Laptop Acer 4", price: 899.99 },
                    { id: 5, title: "Laptop Acer 5", price: 1299.99 },
                    { id: 6, title: "Laptop Acer 6", price: 799.99 },
                ]);
            } finally {
                setLoading(false);
            }
            */
        };

        fetchSearchResults();
    }, [searchQuery]);

    return (
        <div className="page-container">
            <div className="search-results-container">
                <div className="search-header">
                    <h2 className="results-title">Your Search Results</h2>
                    {loading ? (
                        <p className="results-count">Searching...</p>
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
                            <div className="filter-group">
                                <h4>Price Range</h4>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input type="radio" id="price1" name="price" value="0-500" />
                                        <label htmlFor="price1">$0 - $500</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="price2" name="price" value="501-1000" />
                                        <label htmlFor="price2">$501 - $1000</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="price3" name="price" value="1001+" />
                                        <label htmlFor="price3">$1001+</label>
                                    </div>
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4>Condition</h4>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input type="radio" id="new" name="condition" value="new" />
                                        <label htmlFor="new">New</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="used" name="condition" value="used" />
                                        <label htmlFor="used">Used</label>
                                    </div>
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4>Color</h4>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input type="radio" id="bright" name="color" value="bright" />
                                        <label htmlFor="bright">Bright</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="dark" name="color" value="dark" />
                                        <label htmlFor="dark">Dark</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="btn btn-outline-primary" onClick={() => setShowFilter(false)}>
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
                            {searchResults.map((product) => (
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