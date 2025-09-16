import React, { useEffect, useState} from "react";
import apiCalls from "../apicalls";
import {View} from "react-native";


export default function AdminPageQuestionnaire() {
    const [quests, setQuests] = useState(0);
    const [questions, setQuestions] = useState(0);
    const [SelectedQuest, setSelectedQuest] = useState(0);
    const [SelectedQuestion, setSelectedQuestion] = useState(0);
    const [answers, setAnswers] = useState(0);
    const [error, setError] = useState(false);

    useEffect(() => {
        const giveData = async () => {
            let response = await apiCalls.getAvailableQuestionnairesIDs();
            let data = response.data;
            setQuests(data);
        }
        giveData();
    }, []);
    useEffect( () => {
        const giveData =async() => {
            if (quests!==0) {
                setQuestions(0);
                setSelectedQuestion(0);
                setAnswers(0);
                let response = await apiCalls.getQuestionnaire(SelectedQuest.questionnaireID);
                let data = response.data;
                setQuestions(data.questions);
            }
        }
        giveData();
        }, [SelectedQuest]);

    useEffect( () => {
        const giveData =async() => {
            setError(false);
            if (quests!==0 && SelectedQuestion!==0) {
                setAnswers(0);
                try{
                let response = await apiCalls.getQuestionAnswers(SelectedQuest.questionnaireID, SelectedQuestion.qID);
                let data = response.data;
                setAnswers(data.answers);
                } catch (error) {setError(true);}
            }
        }
        giveData();
        }, [SelectedQuestion]);


    function handleClick(quest){
        setSelectedQuest(quest);
    }
    function handleClick2(question){
        setSelectedQuestion(question);
    }
    return (
        <div>
            <a href="/admin_page">
                <button>Back</button>
            </a>
            <p>Select questionnaire to view answers</p>
            {quests!==0 && quests && quests.map(quest =>{
                return(
                    <div key={quest.title}>
                        <button onClick={()=> handleClick(quest)}>
                            {quest.title}
                        </button>
            </div>)})}
            <View >
            {questions!==0 && questions && questions.map(question =>{
                return(
                    <div key={question.qID}>
                        <button onClick={()=> handleClick2(question)}>
                            {question.qtext}
                        </button>
            </div>)})}
                </View>
            <View style={{display: 'flex', alignItems: 'center', height: '100vh'}}>
                {error ? <p>No available answers for this questionnaire </p> :
                    (answers!==0 && answers && answers.map(answer =>{
                return(
                    <div key={answer.session}>
                        <p>
                            Answer { answer.ans} in session {answer.session}
                        </p>
            </div>)}))}
            </View>
        </div>)
    };




