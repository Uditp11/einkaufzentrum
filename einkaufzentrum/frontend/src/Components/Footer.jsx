import React from 'react'
import "../Style/Footer.css"

const Footer = () => {
    return (
        <section className="footer">
            <div className="container py-4">
                <div className="row text-white">
                    <div className='d-flex justify-content-md-between'>
                        <div className=''>
                            <h1>Einkaufzentrum</h1>
                        </div>
                        <div className=" align-items-center align-items-md-end mb-4 mb-md-0">

                            <div className="footer-links d-flex justify-content-center justify-content-md-end">
                                <div>Link 1</div>
                                <div>Link 2</div>
                                <div>Link 3</div>
                                <div>Link 4</div>
                            </div>

                        </div>
                    </div>

                    <div className="social-icons">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                </div>

                <div className="text-center copyright mt-4">
                    © {new Date().getFullYear()} Udit Parihar. All rights reserved.
                </div>
            </div>
        </section>


    )
}

export default Footer;