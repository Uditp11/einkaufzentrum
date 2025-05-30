import React from "react";
import "../Style/Home.css"; // We'll define styles here
import Footer from "./Footer";


const HomePage = () => {
    return (
        <div className="Home">

            {/* Hero Section */}
            <section className="hero-section d-flex align-items-center justify-content-center text-dark">
                <div className="hero-overlay p-4 rounded shadow d-flex flex-column flex-md-row">
                    <div className="hero-img rounded-circle bg-light me-md-4 mb-4 mb-md-0"></div>
                    <div className="hero-content">
                        <h2 className="fw-bold">Einkaufzentrum</h2>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
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
                            Einkaufzentrum is a student-led marketplace making campus buying and selling easy, safe, and local within Hochschule Fulda.
                        </p>
                    </div>

                    {/* Split Layout */}
                    <div className="row align-items-center mb-5 flex-md-row flex-column-reverse">
                        <div className="col-md-6 mt-4 mt-md-0">
                            <h4 className="fw-semibold text-info">About Me</h4>
                            <p className="about-me-text">
                                I'm a passionate developer aiming to bridge the gap in student commerce by building intuitive and accessible web experiences that are practical, modern, and user-first.
                            </p>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="about-img bg-info-subtle"></div>
                        </div>
                    </div>

                    {/* Developer Gallery */}
                    <div className="text-center">
                        <h4 className="fw-semibold text-info mb-4">Meet the Team</h4>
                        <div className="row g-4 justify-content-center">
                            {[...Array(6)].map((_, idx) => (
                                <div className="col-6 col-md-3" key={idx}>
                                    <div className="dev-card mx-auto shadow">
                                        <div className="dev-pic"></div>
                                        <p className="mt-2 fw-bold text-white">Developer {idx + 1}</p>
                                        <p className="mt-2 text-white">Role</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        <Footer/>
        </div>
    );
};

export default HomePage;
