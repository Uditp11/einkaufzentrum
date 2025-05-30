import React from 'react';
import '../Style/Signup.css';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (


        <div className="signup-page">

            <section className="signup-section">
                <Container className="text-center">
                    <h2 className="section-title">Register Here with us</h2>
                    <div className="signup-box mx-auto p-4">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Name" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="email" placeholder="Email" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="password" placeholder="Passkey" />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Control type="password" placeholder="Verify Passkey" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Submit</Button>
                        </Form>
                    </div>
                </Container>
            </section>

        </div>

    )
}

export default Signup