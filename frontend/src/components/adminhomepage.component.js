import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

export default function AdminHomepage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
        setLoading(false);
    }, []);

    // Redirect if not admin
    if (!loading && !isAdmin) {
        return (
            <Container className="my-5" style={{ paddingTop: '80px' }}>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Alert variant="danger" className="text-center">
                            <Alert.Heading>Access Denied</Alert.Heading>
                            <p>You need administrator privileges to access this page.</p>
                            <Button variant="outline-danger" href="/">
                                Return to Homepage
                            </Button>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="my-5" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Container className="my-5" style={{ paddingTop: '80px' }}>
                {/* Header Section */}
                <Row className="justify-content-between align-items-center mb-5">
                    <Col>
                        <h1 className="display-4 fw-bold text-primary">
                            Welcome to IntelliQ
                        </h1>
                        <p className="lead text-muted">
                            Admin Dashboard - Manage your questionnaires and view results
                        </p>
                    </Col>
                    <Col xs="auto">
                        <Button 
                            variant="outline-secondary" 
                            href="/"
                            size="sm"
                        >
                            ← Back to Homepage
                        </Button>
                    </Col>
                </Row>

                {/* Action Cards Section */}
                <Row className="justify-content-center">
                    <Col md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm text-center hover-card">
                            <Card.Body className="d-flex flex-column">
                                <div className="mb-3">
                                    <i className="bi bi-clipboard-data display-4 text-primary"></i>
                                </div>
                                <Card.Title>Questionnaires</Card.Title>
                                <Card.Text>
                                    View and manage all available questionnaires
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button 
                                        variant="primary" 
                                        href="/current_questionnaire"
                                        className="w-100"
                                    >
                                        View Questionnaires
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm text-center hover-card">
                            <Card.Body className="d-flex flex-column">
                                <div className="mb-3">
                                    <i className="bi bi-bar-chart display-4 text-success"></i>
                                </div>
                                <Card.Title>Results & Analytics</Card.Title>
                                <Card.Text>
                                    View answers and analyze questionnaire results
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button 
                                        variant="success" 
                                        href="/admin_page"
                                        className="w-100"
                                    >
                                        View Results
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sign Out Section */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <Card className="border-0 bg-light">
                            <Card.Body>
                                <h5 className="mb-3">Session Management</h5>
                                <Button 
                                    variant="outline-secondary" 
                                    href="/"
                                    size="lg"
                                    onClick={() => {
                                        localStorage.setItem('isAdmin', 'false');
                                        sessionStorage.setItem('isAdmin', 'false');
                                    }}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Sign Out & Return to Homepage
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-dark text-light mt-5 py-4">
                <Container>
                    <Row>
                        <Col md={6}>
                            <h5>IntelliQ</h5>
                            <p className="mb-0">Your intelligent questionnaire platform</p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <p className="mb-0">&copy; 2025 IntelliQ. All rights reserved.</p>
                            <small className="text-muted">Built with React & Bootstrap</small>
                        </Col>
                    </Row>
                </Container>
            </footer>

            <style jsx>{`
                .hover-card {
                    transition: all 0.3s ease-in-out;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                }
                body {
                    padding-top: 0px;
                }
            `}</style>
        </>
    );
}