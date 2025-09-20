# IntelliQ - Smart Questionnaire - Full Stack Application

![Smart Questionnaire](https://img.shields.io/badge/Full%20Stack-Project-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

## 📋 Overview

Smart Questionnaire is a full-stack web application that implements an intelligent questionnaire system where each user response determines the next question presented. This adaptive questioning approach creates a dynamic and personalized user experience.

**Live Demo:** 
- Frontend: https://smart-questionnaire.vercel.app/
- Backend API: https://smart-questionnaire-api.onrender.com/intelliq_api/

## ✨ Features

- **Adaptive Questionnaires**: Dynamic question flow based on user responses
- **Admin Dashboard**: Manage questionnaires and view response analytics
- **RESTful API**: Comprehensive backend API for all operations
- **Real-time Analytics**: View response statistics and session data
- **User-friendly Interface**: Intuitive design for both respondents and administrators
- **Session Management**: Track user sessions and responses

## 🛠️ Technology Stack

### Frontend
- **React** (18.2.0) - User interface library
- **Axios** - HTTP client for API communication
- **CSS3** - Styling and responsive design
- **Vercel** - Deployment platform

### Backend
- **Flask** (2.3.3) - Python web framework
- **Flask-MySQLdb** - MySQL database integration
- **Flask-CORS** - Cross-origin resource sharing
- **Python-dotenv** - Environment variable management
- **Render** - Backend deployment platform

### Database
- **MySQL** - Relational database management system
- **Hosted on**: sql7.freesqldatabase.com

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MySQL database

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/evigiann/smart-questionnaire.git
   cd smart-questionnaire/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:9103/intelliq_api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd ../backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306
   FLASK_DEBUG=True
   ```

5. **Initialize the database**
   - Import the provided SQL schema
   - Or use the API endpoints to create questionnaires

6. **Start the Flask server**
   ```bash
   python app.py
   ```
   The API will be available at http://localhost:9103

## 📊 API Endpoints

The application provides a comprehensive REST API:

- `GET /intelliq_api/available_questionnaires` - List all questionnaires
- `GET /intelliq_api/questionnaire/{questionnaireID}` - Get questionnaire details
- `GET /intelliq_api/question/{questionnaireID}/{questionID}` - Get specific question
- `POST /intelliq_api/doanswer/{questionnaireID}/{questionID}/{session}/{optionID}` - Submit answer
- `GET /intelliq_api/getsessionanswers/{questionnaireID}/{session}` - Get session answers
- `GET /intelliq_api/getquestionanswers/{questionnaireID}/{questionID}` - Get question answers
- `POST /intelliq_api/admin/questionnaire_upd` - Upload new questionnaire (Admin)
- `POST /intelliq_api/admin/resetall` - Reset all data (Admin)
- `POST /intelliq_api/admin/resetq/{questionnaireID}` - Reset specific questionnaire (Admin)

## 🗄️ Database Schema

The application uses a relational database with the following main tables:
- `questionnaire` - Questionnaire metadata
- `question` - Question details
- `answer_options` - Available answer options
- `keywords` - Questionnaire keywords
- `includes` - Relationship between questionnaires and questions
- `filled_questionnaire` - Session tracking
- `answer` - User responses

## 🌐 Deployment

This project demonstrates full CI/CD implementation:

### Frontend Deployment (Vercel)
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Custom domain support

### Backend Deployment (Render)
- Continuous deployment from GitHub
- Environment variables management
- Web service with automatic scaling

### Database (FreeSQLDatabase)
- MySQL database hosting
- Remote connection configuration
- Regular backups and maintenance

## 🧪 Testing

The application includes comprehensive testing:
- API endpoint testing
- Database integration testing
- Frontend component testing
- Cross-browser compatibility testing
- Mobile responsiveness testing

## 🔧 Development Process

This project followed a complete software development lifecycle:
1. **Requirements Analysis** - Based on the provided SRS document
2. **System Design** - Architecture planning and database design
3. **Implementation** - Coding both frontend and backend
4. **Testing** - Comprehensive testing at all levels
5. **Deployment** - CI/CD pipeline setup
6. **Maintenance** - Ongoing updates and improvements

## 📈 Key Features Implemented

- **Adaptive Question Logic**: Questions dynamically change based on previous answers
- **Session Management**: Unique session IDs track user progress
- **Admin Functionality**: Full CRUD operations for questionnaires
- **Response Analytics**: View aggregated answer data
- **RESTful API Design**: Clean, consistent API structure
- **Responsive Design**: Works on desktop and mobile devices

## 🔮 Future Enhancements

- User authentication and authorization
- Advanced analytics and data visualization
- Export functionality (CSV, PDF)
- Question branching with complex logic
- Real-time collaboration features
- Multimedia question support

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Developed as a portfolio project demonstrating full-stack development capabilities including:

- Frontend development with React
- Backend development with Flask
- Database design and management with MySQL
- REST API design and implementation
- Deployment and DevOps practices
- Project documentation
- System architecture design

---

*For more information, please refer to the [Software Requirements Specification](SRS.docx) or contact the development team.*
