import axios from 'axios';
import { API_BASE_URL } from './config';

class apiCalls {
    getAvailableQuestionnairesIDs(){
        return axios.get(API_BASE_URL+'/available_questionnaires');
    }
    getFirstQuestion(questID){
        return axios.get(API_BASE_URL+'/question/first_question/'+questID);
    }
    getQuestionnaire(questID){
        return axios.get(API_BASE_URL+'/questionnaire/' +questID);
    }

    getQuestion(questID, qID){
        return axios.get(API_BASE_URL+'/question/'+questID+'/'+qID);
    }

    postAnswer(questID, qID, session, optID){
        return (
            fetch(API_BASE_URL+'/doanswer/'+questID+'/'+qID+'/'+session+'/'+optID, {
                method: 'POST',})
        )
    };

    getSessionAnswers(questID, session) {
        return axios.get(API_BASE_URL+'/getsessionanswers/'+questID+'/'+session);
    }

    getQuestionAnswers(questID, qID) {
        return axios.get(API_BASE_URL+ '/getquestionanswers/'+questID+'/'+qID);
    }

    getSessionIDs(){
        return axios.get(API_BASE_URL+'/getsessionids')
    }
}
export default new apiCalls();