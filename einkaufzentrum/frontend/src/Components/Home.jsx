import React, { useEffect, useState } from "react";
import "../Style/Home.css";
import Footer from "./Footer";
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaShoppingCart, FaUserFriends, FaCheck, FaUpload, FaRobot, FaClipboardCheck } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import Shimmer from './Shimmer';

const features = [
    {
        icon: "bi bi-cart-check",
        title: "Easy Trading",
        description: "Buy and sell items seamlessly within the university community"
    },
    {
        icon: "bi bi-shield-check",
        title: "Secure Platform",
        description: "Verified university accounts ensure safe transactions"
    },
    {
        icon: "bi bi-chat-dots",
        title: "Direct Communication",
        description: "Chat directly with buyers and sellers"
    }
];

const HomePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initializeAOS = () => {
            AOS.init({
                duration: 1000,
                once: true,
                mirror: false,
                disable: 'mobile'
            });
        };

        const preloadImages = async () => {
            const imagesToPreload = [
                '/ekz-bag-logo.png',
                'https://res.cloudinary.com/heaven3609/image/upload/v1748611114/Estore_hih2rh.png'
            ];

            try {
                await Promise.all(
                    imagesToPreload.map(src => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = src;
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    })
                );
            } catch (error) {
                console.error('Error preloading images:', error);
            }

            if (mounted) {
                setTimeout(() => {
                    if (mounted) {
                        setIsLoading(false);
                        initializeAOS();
                    }
                }, 500);
            }
        };

        preloadImages();

        return () => {
            mounted = false;
        };
    }, []);

    if (isLoading) {
        return <Shimmer />;
    }

    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    };

    const handleGetStarted = () => {
        navigate('/explore');
    };

    return (
        <div className="Home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-7">
                                <div className="hero-content">
                                    <h1 className="hero-title">
                                        WELCOME<br />TO<br />
                                        <span className="text-gradient">EINKAUFZENTRUM</span>
                                    </h1>
                                    <p className="hero-tagline">
                                        <span className="tagline-text">Dein Zentrum für den cleveren Kauf!</span>
                                    </p>
                                    <div className="hero-buttons">
                                        <Link to="/explore" className="custom-btn">START SHOPPING</Link>
                                        <Link to="/signup" className="custom-btn-outline">Join Now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="hero-img">
                                    <img 
                                        src="/ekz-bag-logo.png"
                                        alt="Einkaufzentrum Logo" 
                                        className="hero-img-content"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://res.cloudinary.com/heaven3609/image/upload/v1748610028/einkaufzentrum_gqlk2i.png';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="text-center mb-5">
                        <span className="text-gradient">Why Choose Us?</span>
                    </h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaShoppingCart />
                                </div>
                                <h3>Easy Shopping</h3>
                                <p>Browse through a wide range of student essentials with our user-friendly interface.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FaUserFriends />
                                </div>
                                <h3>Student Community</h3>
                                <p>Connect with fellow students to buy, sell, and exchange items within your campus.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <MdSecurity />
                                </div>
                                <h3>Secure Transactions</h3>
                                <p>Enjoy safe and secure transactions with our trusted payment system.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="about-content">
                                <h2>About Einkaufzentrum</h2>
                                <div className="underline"></div>
                                <p>Einkaufzentrum is your dedicated marketplace designed specifically for students. We understand the unique needs of student life and provide a platform where you can:</p>
                                <ul className="feature-list">
                                    <li><FaCheck />Find affordable textbooks and study materials</li>
                                    <li><FaCheck />Buy and sell dorm essentials</li>
                                    <li><FaCheck />Connect with local student sellers</li>
                                    <li><FaCheck />Get exclusive student discounts</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img 
                                src="https://res.cloudinary.com/heaven3609/image/upload/v1748611114/Estore_hih2rh.png"
                                alt="About Einkaufzentrum" 
                                className="about-section-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://source.unsplash.com/random/800x600?university-students';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="text-center mb-3">
                        <span className="text-gradient">How It Works</span>
                    </h2>
                    <p className="text-center text-muted-light mb-5">
                        Powered by AI to keep the marketplace safe and trustworthy.
                    </p>
                    <div className="row">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="0">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <div className="step-icon">
                                    <FaUpload />
                                </div>
                                <h3>Post Your Listing</h3>
                                <p>Upload your item with photos, set a price, and describe what you're selling. It only takes a minute.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="150">
                            <div className="step-card step-card-highlight">
                                <div className="step-number">2</div>
                                <div className="step-icon">
                                    <FaRobot />
                                </div>
                                <h3>AI Spam Detection</h3>
                                <p>Our CNN model trained on Fashion MNIST automatically scans every image to flag spam and inappropriate content.</p>
                                <span className="step-badge">Machine Learning</span>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <div className="step-icon">
                                    <FaClipboardCheck />
                                </div>
                                <h3>Admin Review & Go Live</h3>
                                <p>Admins review flagged content on the dashboard. Once approved, your listing goes live for the community.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;
