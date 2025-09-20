import React, { useState, useEffect } from "react";
import apiCalls from "../apicalls";
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge } from "react-bootstrap";

export default function AdminPageSession(){
    const [sessions, setSessions] = useState([]);
    const [SelectedSession, setSelectedSession] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [error, setError] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isAdmin) {
            const giveData = async () => {
                try {
                    setLoadingSessions(true);
                    let response = await apiCalls.getSessionIDs();
                    let data = response.data;
                    setSessions(data || []);
                } catch (error) {
                    console.error("Error fetching sessions:", error);
                    setSessions([]);
                } finally {
                    setLoadingSessions(false);
                }
            }
            giveData();
        }
    }, [isAdmin]);

    useEffect(() => {
        const giveData = async () => {
            setError(false);
            setAnswers([]);
            if (SelectedSession) {
                setLoadingAnswers(true);
                try {
                    let response = await apiCalls.getSessionAnswers(SelectedSession.questionnaireID, SelectedSession.session);
                    let data = response.data;
                    setAnswers(data.answers || []);
                } catch (error) {
                    if (error.response && error.response.status === 402) {
                        setError(true);
                        setAnswers([]);
                        console.log("No answers for this session");
                    } else {
                        setError(true);
                        console.error("An error occurred:", error);
                    }
                } finally {
                    setLoadingAnswers(false);
                }
            }
        }
        giveData();
    }, [SelectedSession]);

    function handleClick(sess) {
        if (SelectedSession && SelectedSession.session === sess.session) {
            setSelectedSession(null);
            setAnswers([]);
        } else {
            setSelectedSession(sess);
        }
    }

    return (
        <Container className="my-4" style={{ paddingTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-5 fw-bold text-primary">Session Results</h1>
                <Button variant="outline-secondary" href="/admin_page">
                    ← Back to Admin
                </Button>
            </div>

            <Row>
                {/* Sessions Column */}
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Select Session</h5>
                        </Card.Header>
                        <Card.Body>
                            {loadingSessions ? (
                                <div className="text-center">
                                    <Spinner animation="border" size="sm" />
                                    <p className="mt-2">Loading sessions...</p>
                                </div>
                            ) : sessions && sessions.length > 0 ? (
                                <ListGroup variant="flush">
                                    {sessions.map(sess => (
                                        <ListGroup.Item
                                            key={sess.session}
                                            action
                                            active={SelectedSession && SelectedSession.session === sess.session}
                                            onClick={() => handleClick(sess)}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>
                                                <strong>Session:</strong> {sess.session}
                                                {sess.questionnaireID && (
                                                    <>
                                                        <br />
                                                        <small className="text-muted">
                                                            Questionnaire ID: {sess.questionnaireID}
                                                        </small>
                                                    </>
                                                )}
                                            </span>
                                            <Badge bg="secondary" pill>
                                                {sess.session}
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="info">No sessions available</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Answers Column */}
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                {SelectedSession 
                                    ? `Answers for Session: ${SelectedSession.session}` 
                                    : "Select a Session"
                                }
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {loadingAnswers ? (
                                <div className="text-center">
                                    <Spinner animation="border" size="sm" />
                                    <p className="mt-2">Loading answers...</p>
                                </div>
                            ) : error ? (
                                <Alert variant="warning">No answers available for this session</Alert>
                            ) : SelectedSession && answers && answers.length > 0 ? (
                                <>
                                    <ListGroup variant="flush">
                                        {answers.map((answer, index) => (
                                            <ListGroup.Item key={`${answer.qID}-${index}`}>
                                                <div className="mb-2">
                                                    <strong>Question ID:</strong> 
                                                    <Badge bg="info" className="ms-2">{answer.qID}</Badge>
                                                </div>
                                                <div className="border-start border-primary ps-3">
                                                    <strong>Answer:</strong> {answer.ans}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <div className="mt-3 text-center">
                                        <Badge bg="success">
                                            Total Answers: {answers.length}
                                        </Badge>
                                    </div>
                                </>
                            ) : SelectedSession ? (
                                <Alert variant="info">No answers yet for this session</Alert>
                            ) : (
                                <Alert variant="info">Please select a session first</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};