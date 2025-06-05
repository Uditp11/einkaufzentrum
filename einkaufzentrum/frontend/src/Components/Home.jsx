import React, { useEffect, useState } from "react";
import "../Style/Home.css";
import Footer from "./Footer";
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaShoppingCart, FaUserFriends, FaLock, FaGithub, FaLinkedin, FaCheck } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import Shimmer from './Shimmer';

const developers = [
    {
        name: "Pavithra Purushothaman",
        role: "Project Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612803/pavithra_profile_mubngz.jpg',
        linkedin: "#",
        github: "#"
    },
    {
        name: "Ayush Kaushik",
        role: "Frontend Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1746008303/Mee_f4pdiu.jpg',
        linkedin: "#",
        github: "#"
    },
    {
        name: "Ridhima Tigadi",
        role: "Backend Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612803/ridhima-profile_sjqfzr.jpg',
        linkedin: "#",
        github: "#"
    },
    {
        name: "Mufidha Sukurela",
        role: "Github master",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748613095/female_user_heisft.png',
        linkedin: "#",
        github: "#"
    },
    {
        name: "Udit Parihar",
        role: "Backend developer",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612997/udit_profile_bmlrpx.jpg',
        linkedin: "#",
        github: "#"
    },
    {
        name: "Akhil Baiju",
        role: "Database manager",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748611921/Male_user_bd7rdc.png',
        linkedin: "#",
        github: "#"
    }
];

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

            {/* Team Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="text-center mb-5">
                        <span className="text-gradient">Meet Our Team</span>
                    </h2>
                    <div className="row">
                        {developers.map((dev, idx) => (
                            <div className="col-md-4 mb-4" key={idx}>
                                <div className="dev-card">
                                    <div className="dev-pic">
                                        <img 
                                            src={dev.img}
                                            alt={dev.name}
                                            className="dev-image"
                                        />
                                    </div>
                                    <h3 className="dev-name">{dev.name}</h3>
                                    <p className="dev-role">{dev.role}</p>
                                    <div className="dev-social">
                                        <a href={dev.github} className="social-link" target="_blank" rel="noopener noreferrer">
                                            <FaGithub />
                                        </a>
                                        <a href={dev.linkedin} className="social-link" target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;
