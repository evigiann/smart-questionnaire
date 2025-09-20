import React, { useEffect, useState} from "react";
import apiCalls from "../apicalls";
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge } from "react-bootstrap";

export default function AdminPageQuestionnaire() {
    const [quests, setQuests] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [SelectedQuest, setSelectedQuest] = useState(null);
    const [SelectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState(false);
    const [loadingQuests, setLoadingQuests] = useState(true);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [loadingAnswers, setLoadingAnswers] = useState(false);

    useEffect(() => {
        const giveData = async () => {
            try {
                setLoadingQuests(true);
                let response = await apiCalls.getAvailableQuestionnairesIDs();
                let data = response.data;
                setQuests(data);
            } catch (error) {
                console.error("Error fetching questionnaires:", error);
            } finally {
                setLoadingQuests(false);
            }
        };
        giveData();
    } , []);
     

    useEffect( () => {
        const giveData =async() => {
            if (SelectedQuest) {
                setLoadingQuestions(true);
                setQuestions([]);
                setSelectedQuestion(null);
                setAnswers([]);
                try{
                    let response = await apiCalls.getQuestionnaire(SelectedQuest.questionnaireID);
                    let data = response.data;
                    setQuestions(data.questions);
                }
                catch (error) {
                    if (error.response && error.response.status === 402) {
                        setQuestions([]);
                        console.log("No questions for this questionnaire");
                    } else {
                        console.error("An error occurred:", error);
                    }
                } finally {
                    setLoadingQuestions(false);
                }
            }
        }
        giveData();
        }, [SelectedQuest]);

    useEffect( () => {
        const giveData =async() => {
            setError(false);
            setAnswers([]);
            if (SelectedQuest && SelectedQuestion) {
                setLoadingAnswers(true);
                try {
                    let response = await apiCalls.getQuestionAnswers(SelectedQuest.questionnaireID, SelectedQuestion.qID);
                    let data = response.data;
                    setAnswers(data.answers);
                } catch (error) {
                    if (error.response && error.response.status === 402) {
                        setError(true);
                        setAnswers([])
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
        }, [SelectedQuestion, SelectedQuest]);


    function handleClick(quest){
        if (SelectedQuest && SelectedQuest.questionnaireID === quest.questionnaireID) {
            setSelectedQuest(null);
            setQuestions([]);
            setSelectedQuestion(null);
            setAnswers([]);
        } else {
            setSelectedQuest(quest);
        }
    }

    function handleClick2(question){
        if (SelectedQuestion && SelectedQuestion.qID === question.qID) {
            setSelectedQuestion(null);
            setAnswers([]);
        } else {
            setSelectedQuestion(question);
        }
    }
    return (
        <Container className="my-4" style={{ paddingTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Questionnaire Answers</h1>
                <Button variant="outline-secondary" href="/admin_page">
                    ← Back to Admin
                </Button>
            </div>

            <Row>
                {/* Questionnaires Column */}
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Select Questionnaire</h5>
                        </Card.Header>
                        <Card.Body>
                            {loadingQuests ? (
                                <div className="text-center">
                                    <Spinner animation="border" size="sm" />
                                    <p className="mt-2">Loading questionnaires...</p>
                                </div>
                            ) : quests && quests.length > 0 ? (
                                <ListGroup variant="flush">
                                    {quests.map(quest => (
                                        <ListGroup.Item
                                            key={quest.questionnaireID}
                                            action
                                            active={SelectedQuest && SelectedQuest.questionnaireID === quest.questionnaireID}
                                            onClick={() => handleClick(quest)}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {quest.title}
                                            <Badge bg="secondary" pill>
                                                ID: {quest.questionnaireID}
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="info">No questionnaires available</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Questions Column */}
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                {SelectedQuest ? `Questions in ${SelectedQuest.title}` : "Select a Questionnaire"}
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {loadingQuestions ? (
                                <div className="text-center">
                                    <Spinner animation="border" size="sm" />
                                    <p className="mt-2">Loading questions...</p>
                                </div>
                            ) : SelectedQuest && questions && questions.length > 0 ? (
                                <ListGroup variant="flush">
                                    {questions.map(question => (
                                        <ListGroup.Item
                                            key={question.qID}
                                            action
                                            active={SelectedQuestion && SelectedQuestion.qID === question.qID}
                                            onClick={() => handleClick2(question)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {question.qtext}
                                            <br />
                                            <small className="text-muted">ID: {question.qID}</small>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : SelectedQuest ? (
                                <Alert variant="info">No questions available for this questionnaire</Alert>
                            ) : (
                                <Alert variant="info">Please select a questionnaire first</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Answers Column */}
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                {SelectedQuestion ? `Answers for: ${SelectedQuestion.qtext}` : "Select a Question"}
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {loadingAnswers ? (
                                <div className="text-center">
                                    <Spinner animation="border" size="sm" />
                                    <p className="mt-2">Loading answers...</p>
                                </div>
                            ) : error ? (
                                <Alert variant="warning">No answers available for this question</Alert>
                            ) : SelectedQuestion && answers && answers.length > 0 ? (
                                <>
                                    <h6>{SelectedQuestion.qtext}</h6>
                                    <ListGroup variant="flush">
                                        {answers.map((answer, index) => (
                                            <ListGroup.Item key={`${answer.session}-${index}`}>
                                                <div className="d-flex justify-content-between">
                                                    <span>
                                                        <strong>Answer:</strong> {answer.ans}
                                                    </span>
                                                    <Badge bg="secondary">
                                                        Session: {answer.session}
                                                    </Badge>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <div className="mt-3">
                                        <Badge bg="info">
                                            Total Answers: {answers.length}
                                        </Badge>
                                    </div>
                                </>
                            ) : SelectedQuestion ? (
                                <Alert variant="info">No answers yet for this question</Alert>
                            ) : (
                                <Alert variant="info">Please select a question first</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};