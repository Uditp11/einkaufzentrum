import React from 'react';
import '../Style/Shimmer.css';

const Shimmer = () => {
    return (
        <div className="shimmer-wrapper">
            {/* Hero Section Shimmer */}
            <div className="shimmer-hero">
                <div className="shimmer-container">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="shimmer-content">
                                <div className="shimmer-title"></div>
                                <div className="shimmer-text"></div>
                                <div className="shimmer-buttons">
                                    <div className="shimmer-button"></div>
                                    <div className="shimmer-button"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="shimmer-image"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section Shimmer */}
            <div className="shimmer-features">
                <div className="container">
                    <div className="shimmer-section-title"></div>
                    <div className="row">
                        {[1, 2, 3].map((_, idx) => (
                            <div className="col-md-4" key={idx}>
                                <div className="shimmer-card">
                                    <div className="shimmer-icon"></div>
                                    <div className="shimmer-card-title"></div>
                                    <div className="shimmer-text"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Section Shimmer */}
            <div className="shimmer-about">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="shimmer-content">
                                <div className="shimmer-title"></div>
                                <div className="shimmer-text"></div>
                                <div className="shimmer-text"></div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="shimmer-image"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shimmer; 