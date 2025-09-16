import axios from 'axios';
const BASE_URL = "http://localhost:9103/intelliq_api";

class apiCalls {
    getAvailableQuestionnairesIDs(){
        return axios.get(BASE_URL+'/available_questionnaires');
    }
    getFirstQuestion(questID){
        return axios.get(BASE_URL+'/question/first_question/'+questID);
    }
    getQuestionnaire(questID){
        return axios.get(BASE_URL+'/questionnaire/' +questID);
    }

    getQuestion(questID, qID){
        return axios.get(BASE_URL+'/question/'+questID+'/'+qID);
    }

    postAnswer(questID, qID, session, optID){
        return (
            fetch(BASE_URL+'/doanswer/'+questID+'/'+qID+'/'+session+'/'+optID, {
                method: 'POST',})
        )
    };

    getSessionAnswers(questID, session) {
        return axios.get(BASE_URL+'/getsessionanswers/'+questID+'/'+session);
    }

    getQuestionAnswers(questID, qID) {
        return axios.get(BASE_URL+ '/getquestionanswers/'+questID+'/'+qID);
    }

    getSessionIDs(){
        return axios.get(BASE_URL+'/getsessionids')
    }
}
export default new apiCalls();