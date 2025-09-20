import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function AdminPage() {
    return (
        <Container className="my-5" style={{ paddingTop: '80px' }}>
            {/* Header Section */}
            <Row className="text-center mb-4 justify-content-between align-items-center">
                <Col>
                    <h1 className="display-5 fw-bold text-primary">
                        Admin Dashboard
                    </h1>
                    <p className="lead text-muted">
                        Select your preferred view mode for results
                    </p>
                </Col>
                {/* Back Button */}
                <Col>
                    <Button 
                        variant="outline-secondary" 
                        href="/"
                    >
                        ← Back to Homepage
                    </Button>
                </Col>
            </Row>


            {/* View Mode Selection Cards */}
            <Row className="justify-content-center">
                <Col md={6} lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                                <i className="bi bi-clipboard-data display-4 text-primary"></i>
                            </div>
                            <Card.Title>Questionnaire View</Card.Title>
                            <Card.Text>
                                View results organized by questionnaire. See all answers for each question across different sessions.
                            </Card.Text>
                            <div className="mt-auto">
                                <Button 
                                    variant="primary" 
                                    href="/admin_page_questionnaire"
                                    className="w-100"
                                >
                                    View by Questionnaire
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                                <i className="bi bi-people display-4 text-success"></i>
                            </div>
                            <Card.Title>Session View</Card.Title>
                            <Card.Text>
                                View results organized by session. See all answers from a single session across different questionnaires.
                            </Card.Text>
                            <div className="mt-auto">
                                <Button 
                                    variant="success" 
                                    href="/admin_page_session"
                                    className="w-100"
                                >
                                    View by Session
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}