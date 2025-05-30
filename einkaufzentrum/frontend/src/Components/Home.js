import React from "react";
import "../Style/Home.css";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

const developers = [
    {
        name: "Pavithra Purushothaman",
        role: "Project Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612803/pavithra_profile_mubngz.jpg'
    },
    {
        name: "Ayush Kaushik",
        role: "Frontend Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1746008303/Mee_f4pdiu.jpg'
    },
    {
        name: "Ridhima Tigadi",
        role: "Backend Lead",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612803/ridhima-profile_sjqfzr.jpg'
    },
    {
        name: "Mufidha Sukurela",
        role: "Github master",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748613095/female_user_heisft.png'
    },
    {
        name: "Udit Parihar",
        role: "Backend developer",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748612997/udit_profile_bmlrpx.jpg'
    },
    {
        name: "Akhil Baiju",
        role: "Database manager",
        img: 'https://res.cloudinary.com/heaven3609/image/upload/v1748611921/Male_user_bd7rdc.png'
    }
];

const HomePage = () => {
    const navigate = useNavigate();

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
            <section className="hero-section d-flex align-items-center justify-content-center text-dark">
                <div className="hero-overlay p-5 rounded-lg shadow-lg d-flex flex-column flex-md-row align-items-center">
                    <div className="hero-img me-md-5 mb-4 mb-md-0">
                        <img src='https://res.cloudinary.com/heaven3609/image/upload/v1748610028/einkaufzentrum_gqlk2i.png' 
                             alt="Einkaufzentrum" 
                             className="hero-img-content" />
                    </div>
                    <div className="hero-content text-center text-md-start">
                        <h2 className="hero-title">
                            <span className="text-gradient">Einkaufzentrum</span>
                        </h2>
                        <p className="hero-tagline">
                            <span className="tagline-text">Dein Zentrum für den cleveren Kauf!</span>
                        </p>
                        <div className="hero-buttons mt-4">
                            <button 
                                className="btn btn-primary btn-lg me-3 custom-btn"
                                onClick={handleGetStarted}
                            >
                                Get Started
                            </button>
                            <button 
                                className="btn btn-outline-light btn-lg custom-btn-outline"
                                onClick={scrollToAbout}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="about-section text-white">
                <div className="container py-5">
                    {/* Title */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-5">About Us</h2>
                        <div className="underline mx-auto my-3"></div>
                        <p className="lead">
                            Einkaufzentrum is the official marketplace platform for students, faculty, and staff of Hochschule Fulda. Whether you're looking to buy or sell, our platform makes it easy to connect with others on campus. From textbooks and electronics to furniture and more, you can find what you need or offer what you have—all in one place. With user-friendly features tailored for both buyers and sellers, Einkaufzentrum offers a trusted and convenient space to trade within the university community.
                        </p>
                    </div>

                    {/* Split Layout */}
                    <div className="row align-items-center mb-5 flex-md-row flex-column-reverse">
                        <div className="col-md-6 mt-4 mt-md-0">
                            <h4 className="fw-semibold text-info">About Us</h4>
                            <p className="about-me-text">
                                We are passionate developers aiming to bridge the gap in student commerce by building intuitive and accessible web experiences that are practical, modern, and user-first.
                            </p>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <img 
                                src="https://res.cloudinary.com/heaven3609/image/upload/v1748611114/Estore_hih2rh.png" 
                                alt="about" 
                                className="about-section-img"
                            />
                        </div>
                    </div>

                    {/* Developer Gallery */}
                    <div className="text-center">
                        <h4 className="fw-semibold text-info mb-4">Meet the Team</h4>
                        <div className="row g-4">
                            {developers.map((dev, idx) => (
                                <div className="col-12 col-sm-6 col-md-4" key={idx}>
                                    <div className="dev-card mx-auto">
                                        <div className="dev-pic">
                                            <img src={dev.img} alt={dev.name} className="dev-image" />
                                        </div>
                                        <h5 className="dev-name mt-3 mb-1">{dev.name}</h5>
                                        <p className="dev-role mb-0">{dev.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;
