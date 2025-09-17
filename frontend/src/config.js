const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://smart-questionnaire-api.onrender.com/intelliq_api'
  : 'http://localhost:9103/intelliq_api';

export default API_BASE_URL;