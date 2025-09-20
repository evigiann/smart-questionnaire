import React, {useState, useEffect} from "react";
import apiCalls from "../apicalls";
import { v4 as uuid } from 'uuid';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from "react-bootstrap";

export default function CurrentQuestionnaire() {
    const [unique_id, setUniqueID] = useState('');
    const [quests, setQuests] = useState([]);
    const [selected, setSelected] = useState(false);
    const [questID, setQuestID] = useState(0);
    const [isFirst, setIsFirst] = useState(false);
    const [qID, setqID] = useState(0);
    const [question, setQuestion] = useState(null);
    const [temp, setTemp] = useState(null);
    const [end, changeEnd] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    useEffect(() => {
        const giveData = async () => {
            try {
                setLoading(true);
                let response = await apiCalls.getAvailableQuestionnairesIDs();
                let data = response.data;
                setQuests(data || []);
            } catch (error) {
                console.error("Error fetching questionnaires:", error);
            } finally {
                setLoading(false);
            }
        }
        giveData();
    }, []);

    function handleClick(questionnaire) {
        setIsFirst(true);
        setUniqueID(uuid().slice(0, 4));
        setSelected(true);
        setQuestID(questionnaire);
    }

    useEffect(() => {
        const giveData = async () => {
            if (isFirst) {
                setLoadingQuestion(true);
                try {
                    let response = await apiCalls.getFirstQuestion(questID);
                    let data = response.data;
                    setqID(data.qID);
                    setQuestion(data);
                } catch (error) {
                    console.error("Error fetching first question:", error);
                } finally {
                    setLoadingQuestion(false);
                }
            }
        }
        giveData();
    }, [questID]);

    function handleClick2(possible_option) {
        setTemp(possible_option);
        if (possible_option.nextqID === qID) {
            changeEnd(true);
        } else {
            changeEnd(false);
        }
    }

    function handleClick3() {
        setIsFirst(false);
        apiCalls.postAnswer(questID, qID, unique_id, temp.optID);
        console.log(unique_id);
        setqID(temp.nextqID);
        setTemp(null); // Reset selection for next question
    }

    useEffect(() => {
        const giveData = async () => {
            if (!isFirst && selected && qID) {
                setLoadingQuestion(true);
                try {
                    let response = await apiCalls.getQuestion(questID, qID);
                    let data = response.data;
                    setQuestion(data);
                } catch (error) {
                    console.error("Error fetching question:", error);
                } finally {
                    setLoadingQuestion(false);
                }
            }
        }
        giveData();
    }, [qID, isFirst, selected]);

    function handleClick4() {
        apiCalls.postAnswer(questID, qID, unique_id, temp.optID)
            .then((response) => console.log(response.data));
        setSubmitted(true);
    }

    return (
        <Container className="my-5" style={{ paddingTop: '80px' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-5 fw-bold text-primary">IntelliQ Questionnaires</h1>
                <Button variant="outline-secondary" href="/">
                    ← Back to Homepage
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading questionnaires...</p>
                </div>
            )}

            {/* Questionnaire Selection */}
            {!selected && !loading && (
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">Available Questionnaires</h4>
                            </Card.Header>
                            <Card.Body>
                                {quests && quests.length > 0 ? (
                                    <Row>
                                        {quests.map((questionnaire) => (
                                            <Col md={6} className="mb-3" key={questionnaire.questionnaireID}>
                                                <Card className="h-100 border-2 hover-card" style={{ cursor: 'pointer' }}>
                                                    <Card.Body 
                                                        className="d-flex flex-column text-center"
                                                        onClick={() => handleClick(questionnaire.questionnaireID)}
                                                    >
                                                        <Card.Title className="text-primary">
                                                            {questionnaire.title}
                                                        </Card.Title>
                                                        <div className="mt-auto">
                                                            <Button variant="primary" className="w-100">
                                                                Start Questionnaire
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <Alert variant="info" className="text-center">
                                        No questionnaires available at the moment.
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Question Display */}
            {selected && !submitted && (
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {loadingQuestion ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" />
                                <p className="mt-2">Loading question...</p>
                            </div>
                        ) : question ? (
                            <Card className="shadow-sm">
                                <Card.Header className="bg-success text-white">
                                    <h5 className="mb-0">Question</h5>
                                </Card.Header>
                                <Card.Body>
                                    <h4 className="mb-4">{question.qtext}</h4>
                                    
                                    {question.options && question.options.length > 0 && (
                                        <Form>
                                            {question.options.map((option) => (
                                                <Form.Check
                                                    key={option.optID}
                                                    type="radio"
                                                    name="questionOptions"
                                                    id={`option-${option.optID}`}
                                                    label={option.opttxt}
                                                    checked={temp && temp.optID === option.optID}
                                                    onChange={() => handleClick2(option)}
                                                    className="mb-3"
                                                />
                                            ))}
                                        </Form>
                                    )}

                                    <div className="d-flex justify-content-center mt-4">
                                        {end ? (
                                            <Button 
                                                variant="success" 
                                                size="lg"
                                                onClick={handleClick4}
                                                disabled={!temp}
                                            >
                                                Finish Questionnaire
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="primary" 
                                                size="lg"
                                                onClick={handleClick3}
                                                disabled={!temp}
                                            >
                                                Next Question →
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        ) : (
                            <Alert variant="warning" className="text-center">
                                Unable to load question. Please try again.
                            </Alert>
                        )}
                    </Col>
                </Row>
            )}

            {/* Completion Message */}
            {submitted && (
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Alert variant="success" className="text-center">
                            <Alert.Heading>Thank You!</Alert.Heading>
                            <p className="mb-3">
                                This is the end of the questionnaire. Thank you for participating!
                            </p>
                            <Button variant="outline-success" href="/">
                                Return to Homepage
                            </Button>
                        </Alert>
                    </Col>
                </Row>
            )}

            <style jsx>{`
                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </Container>
    );
};