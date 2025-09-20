import React, {useState, useEffect} from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

export default function Homepage(){
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Load admin status from localStorage on component mount
    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
    }, []);
    
    function handleClick() {
        const newAdminStatus = !isAdmin;
        setIsAdmin(newAdminStatus);
        // Store admin status in localStorage
        localStorage.setItem('isAdmin', newAdminStatus.toString());
        
        // Also store in sessionStorage for cross-component access
        sessionStorage.setItem('isAdmin', newAdminStatus.toString());
    }

    return (
        <Container className="my-5">
            {/* Hero Section */}
            <Row className="text-center mb-5">
                <Col>
                    <h1 className="display-3 fw-bold text-primary mb-3 mt-5">
                        Welcome to IntelliQ
                    </h1>
                    <p className="lead text-muted">
                        Your intelligent questionnaire platform for surveys and data collection
                    </p>
                </Col>
            </Row>

            {/* Admin Status Alert */}
            {isAdmin && (
                <Row className="justify-content-center mb-4">
                    <Col lg={6}>
                        <Alert variant="info" className="text-center">
                            <i className="bi bi-shield-check me-2"></i>
                            You are signed in as an administrator
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Main Action Cards */}
            <Row className="justify-content-center">
                {/* Questionnaires Card */}
                <Col md={6} lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center hover-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                                <i className="bi bi-clipboard-data display-4 text-primary"></i>
                            </div>
                            <Card.Title className="h4">View Questionnaires</Card.Title>
                            <Card.Text className="text-muted">
                                Browse and participate in available questionnaires
                            </Card.Text>
                            <div className="mt-auto">
                                <Button 
                                    variant="primary" 
                                    href="/current_questionnaire"
                                    className="w-100"
                                    size="lg"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Admin Results Card - Only shown when admin */}
                {isAdmin && (
                    <Col md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm text-center hover-card">
                            <Card.Body className="d-flex flex-column">
                                <div className="mb-3">
                                    <i className="bi bi-bar-chart display-4 text-success"></i>
                                </div>
                                <Card.Title className="h4">Admin Dashboard</Card.Title>
                                <Card.Text className="text-muted">
                                    View results, analytics, and manage questionnaires
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button 
                                        variant="success" 
                                        href="/admin_page"
                                        className="w-100"
                                        size="lg"
                                    >
                                        View Results
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Admin Toggle Section */}
            <Row className="justify-content-center mt-5">
                <Col lg={6} className="text-center">
                    <Card className="border-0 bg-light">
                        <Card.Body>
                            <h5 className="mb-3">Administrator Access</h5>
                            {!isAdmin ? (
                                <Button 
                                    variant="outline-primary" 
                                    onClick={handleClick}
                                    size="lg"
                                >
                                    <i className="bi bi-key me-2"></i>
                                    Sign In as Admin
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClick}
                                    size="lg"
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Log Out
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Features Section */}
            <Row className="mt-5 pt-5 border-top">
                <Col md={4} className="text-center mb-3">
                    <i className="bi bi-lightning display-5 text-warning mb-2"></i>
                    <h5>Fast & Easy</h5>
                    <p className="text-muted small">Quick setup and user-friendly interface</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                    <i className="bi bi-graph-up display-5 text-info mb-2"></i>
                    <h5>Smart Analytics</h5>
                    <p className="text-muted small">Comprehensive results and insights</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                    <i className="bi bi-shield-check display-5 text-success mb-2"></i>
                    <h5>Secure & Reliable</h5>
                    <p className="text-muted small">Your data is safe and protected</p>
                </Col>
            </Row>

            <style jsx>{`
                .hover-card {
                    transition: all 0.3s ease-in-out;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                }
            `}</style>
        </Container>
    );
}