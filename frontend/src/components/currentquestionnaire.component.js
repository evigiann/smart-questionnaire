import React, {useState, useEffect} from "react";
import apiCalls from "../apicalls";
import { v4 as uuid } from 'uuid';
import {View, Text} from "react-native";


export default function CurrentQuestionnaire() {
    const [unique_id, setUniqueID] = useState(0);
    const [quests, setQuests] = useState([]); //quests:json with questionnaireIDs and titles
    const [selected, setSelected] = useState(false);
    const [questID, setQuestID] = useState(0); //questID:id of chosen questionnaire
    const [isFirst, setIsFirst] = useState(false); //signifies if the first question must be displayed
    const [qID, setqID] = useState(0); //id of the current question
    const [question, setQuestion] = useState(0); //question: object of question
    const [temp, setTemp]=useState(0); //temp: temporary nextqID, changes when radio buttons are pressed
    const [end, changeEnd] = useState(false); //signifies that the questionnaire has ended
    const [submitted, setSubmitted] = useState(false);

    useEffect(()=>{ //shows all questionnaires
         const giveData = async () => {
            let response = await apiCalls.getAvailableQuestionnairesIDs();
            let data = response.data;
            setQuests(data);
        }
        giveData();
    }, []);

    function handleClick(questionnaire) { //when user chooses questionnaire
        setIsFirst(true);
        setUniqueID(uuid().slice(0, 4));
        setSelected(true);
        setQuestID(questionnaire);
    }

    useEffect(() => { //
        const giveData = async () => {
            if (isFirst) {
                let response = await apiCalls.getFirstQuestion(questID);
                let data = response.data;
                setqID(data.qID);
                // setIsFirst(false);
                setQuestion(data);
            }
        }
        giveData();
    }, [questID]);

    function handleClick2(possible_option) { //saves choice when clicking radio buttons
        setTemp(possible_option);
        if (possible_option.nextqID === qID) {changeEnd(true);}
        else {changeEnd(false);}
    }
    function handleClick3() {
        setIsFirst(false);
        apiCalls.postAnswer(questID, qID, unique_id, temp.optID);
        console.log(unique_id)
        setqID(temp.nextqID);
    }
    useEffect(() => {
        const giveData = async () => {
            if (!isFirst && selected) {
            let response = await apiCalls.getQuestion(questID,qID);
            let data = response.data;
            setQuestion(data);
            }
        }
        giveData();
        }, [qID]);


    function handleClick4() { //submit answers
        apiCalls.postAnswer(questID, qID, unique_id, temp.optID).then((response)=>console.log(response.data));
        setSubmitted(true);
    }

        return(

            <div>
                <a href="/">
                    <button> Back to Homepage </button>
                </a>
                <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                {!selected && quests && quests.map((questionnaire)=>{ //buttons for questionnaires
                    return(
                        <div key={questionnaire.questionnaireID}>
                            <button  onClick={() => {handleClick(questionnaire.questionnaireID)}}>
                        {questionnaire.title}
                            </button>
                    </div>
                    )
                })
                }
                 {!submitted && question!==0 ? <div><p>{question.qtext}</p></div> :null }
                {!submitted &&questID!==0 && question.options!==0 && question.options && (question.options).map((option)=> {
                    return( //buttons for selecting option of question
                        <div className="radio_buttons" key={option.optID}>
                            <label>
                                <input type="radio" value={option.optID}
                                       onClick={() => {handleClick2(option)}}
                                       name="r" className="radio"/>
                                {option.opttxt}
                            </label>
                        </div>
                    )
                    }
                )}

                {!submitted && selected ?
                    (<div>
                    {!isFirst && end ?
                        <div>
                            <button onClick={() => {handleClick4()}}> End </button>
                        </div>
                    :<div><button onClick={() => {handleClick3()}}> Next </button></div>}
                </div>): null}

                {submitted?
                    <div> <Text style={{textAlign: 'center',fontWeight: 'bold'}}>This is the end of the questionnaire,
                        thank you for participating!</Text> </div>: null }
                </View>
            </div>

        );
};