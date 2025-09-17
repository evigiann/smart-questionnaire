const getApiBaseUrl = () => {
  // Use environment variable if set (for Vercel)
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Use config based on NODE_ENV
  return process.env.NODE_ENV === 'production' 
    ? 'https://smart-questionnaire-api.onrender.com/intelliq_api'
    : 'http://localhost:9103/intelliq_api';
};

const config = {
  API_BASE_URL: getApiBaseUrl()
};

export default config;