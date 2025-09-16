import React, { useState, useEffect } from "react";
import apiCalls from "../apicalls";
import {View} from "react-native";

export default function AdminPageSession(){
    const [sessions, setSessions]=useState(0);
    const [SelectedSession, setSelectedSession]=useState(0);
    const[answers, setAnswers]=useState(0);

    useEffect(() => {
        const giveData = async () => {
            let response = await apiCalls.getSessionIDs();
            let data = response.data;
            setSessions(data);
        }
        giveData();
    }, []);

     useEffect(() => {

         const giveData = async () => {
             if(sessions!==0 && SelectedSession){
                try{
                    let response = await apiCalls.getSessionAnswers(SelectedSession.questionnaireID,SelectedSession.session);
                    let data = response.data;
                    setAnswers(data.answers);
                } catch (error) {
                    if (error.response && error.response.status === 402) {
                        setAnswers([])
                        console.log("No answers for this session" );
                    } else {
                        console.error("An error occurred:", error);
                    }
                }
            }
        }
        giveData();
        }, [SelectedSession]);

    function handleClick(sess){
        setSelectedSession(sess);
    }
        return(
            <div>
                <a href="/admin_page">
                    <button>Back</button>
                </a>
                <p>Select session to view results</p>
                {sessions!==0 && sessions && sessions.map(sess =>{
                return(
                    <div key={sess.session}>
                        <button onClick={()=> handleClick(sess)}>
                            {sess.session}
                        </button>
            </div>)})}
                <View style={{display: 'flex', alignItems: 'center', height: '100vh'}}>
                {answers!==0 && answers && answers.map((answer)=>{
                    return(
                        <div key={answer.qID}>
                                   Given answer: {answer.ans} in question with ID: {answer.qID}
                        </div>)}
                )}
                </View>
            </div>
        )
    };