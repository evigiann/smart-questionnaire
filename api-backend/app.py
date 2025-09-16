# Using flask to make an api
import json

# import necessary libraries and functions
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL

# creating a Flask app
app = Flask(__name__, template_folder='../frontend')
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'intelliq'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JSON_SORT_KEYS'] = False
mysql = MySQL(app)


# cors enabling 
from flask_cors import CORS
CORS(app)

# base url
PREFIX = "/intelliq_api"


# error handling
class api_error(Exception):
    """All custom API Exceptions"""
    pass


class BadRequest(api_error):
    status_code = 400
    message = 'A call parameter is missing or is wrong'


class NoData(api_error):
    status_code = 402
    message = 'The call returned with no data'


@app.errorhandler(api_error)
def handle_exception(err):
    response = {"error": err.status_code, "message": err.message}
    return jsonify(response), err.status_code


@app.errorhandler(Exception)
def handle_exception(err):
    response = {"error": 500, "message": "Sorry, there has been an internal server error"}
    return jsonify(response), 500


# homepage
@app.route(f"{PREFIX}/", methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        data = "welcome to intelliq!"
        return jsonify(data), 200


# checks if db is connected and returns db data
@app.route(f"{PREFIX}/admin/healthcheck", methods=['GET'])
def check_db_connection():
    try:
        # to check if db is connected we will execute a raw query
        cur = mysql.connection.cursor()
        cur.execute("""SELECT 1""")
        details = cur.fetchall()
        cur.close()
        return jsonify({"status": "OK", "dbconnection": "the database is now connected"})

    except Exception as e:
        return jsonify({"status": "failed", "dbconnection": "there has been some mistake in the connection of the database"})


# admin uploading a questionnaire in json form
@app.route(f"{PREFIX}/admin/questionnaire_upd", methods=['POST'])
def upload_questionnaire():
    try:
        content = request.get_json()
        content = json.loads(content)
        questionnaireID = content["questionnaireID"]
        questionnaireTitle = content["questionnaireTitle"]
        cur = mysql.connection.cursor()
        cur.execute("""INSERT INTO questionnaire(questionnaire_id,title)
            VALUES ('{}','{}');""".format(questionnaireID, questionnaireTitle))
        for keyword in content["keywords"]:
            cur.execute("""INSERT INTO keywords(keyword,questionnaire_id)
                     VALUES ('{}','{}');""".format(keyword, questionnaireID))
        for question in content["questions"]:
            qID = question["qID"]
            qtext = question["qtext"]
            required = question["required"]
            type = question["type"]
            cur.execute("""INSERT INTO question(question_id,question_text,question_required, 
                question_type) VALUES('{}','{}','{}','{}');""".format(qID, qtext, required, type))
            cur.execute("""INSERT INTO includes(questionnaire_id,question_id) 
                VALUES ('{}','{}');""".format(questionnaireID, qID))
            for option in question["options"]:
                optID = option["optID"]
                opttxt = option["opttxt"]
                nextqID = option["nextqID"]
                cur.execute("""INSERT INTO answer_options(option_id,question_id,option_text,next_question_id)
                        VALUES ('{}','{}','{}','{}');""".format(optID, qID, opttxt, nextqID))
        mysql.connection.commit()
        return {"status": "OK"}, 200
    except Exception as error:
        raise BadRequest


# initializing all questionnaires and answers and returning possible error codes if necessary
@app.route(f"{PREFIX}/admin/resetall", methods=['POST', 'GET'])
def initialize_questionnaires():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""DELETE FROM answer;""")
        cur.execute("""DELETE FROM filled_questionnaire;""")
        cur.execute("""DELETE FROM answer_options;""")
        cur.execute("""DELETE FROM includes;""")
        cur.execute("""DELETE FROM question;""")
        cur.execute("""DELETE FROM keywords;""")
        cur.execute("""DELETE FROM questionnaire;""")
        mysql.connection.commit()
        return {"status": "OK"}, 200
    except Exception as e:
        return {"status": "failed", "reason": "something went wrong with the deletions in the database"}


# deletes all answers to a questionnaire with a specific questionnaire_id and returns error codes if necessary
@app.route(f"{PREFIX}/admin/resetq/<questionnaireID>", methods=['POST', 'GET'])
def delete_answers(questionnaireID):
    try:
        cur = mysql.connection.cursor()
        cur.execute("""DELETE FROM filled_questionnaire WHERE questionnaire_id='{}';""".format(questionnaireID))
        cur.execute("""DELETE FROM answer WHERE questionnaire_id='{}';""".format(questionnaireID))
        mysql.connection.commit()
        return {"status": "OK"}, 200
    except Exception as e:
        return {"status": "failed", "reason": "something went wrong with the deletions in the database"}


# returns basic data for a questionnaire
@app.route(f"{PREFIX}/questionnaire/<questionnaireID>", methods=['GET'])
def return_questionnaire_object(questionnaireID):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire.questionnaire_id,title,question.question_id,question_text,
    includes.questionnaire_id, question_required,question_type FROM questionnaire 
    INNER JOIN includes ON questionnaire.questionnaire_id=includes.questionnaire_id 
    INNER JOIN question ON question.question_id=includes.question_id
    WHERE questionnaire.questionnaire_id='{}'
    ORDER BY question.question_id;""".format(questionnaireID))
    rv = cur.fetchall()
    cur.execute("""SELECT DISTINCT keyword, questionnaire_id FROM keywords 
    WHERE questionnaire_id='{}';""".format(questionnaireID))
    kw = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        keywords = []
        cur.close()
        content = {}
        for result in kw:
            keywords.append(result['keyword'])
        for result in rv:
            content = {'qID': result['question_id'],
                       'qtext': result['question_text'],
                       'required': result['question_required'],
                       'type': result['question_type']}
            details.append(content)
            content = {}
        content = {'questionnaireID': result['questionnaire_id'],
                   'questionnaireTitle': result['title'],
                   'keywords': keywords,
                   'questions': details}
        return jsonify(content), 200


# returns data for a question
@app.route(f"{PREFIX}/question/<questionnaireID>/<questionID>", methods=['GET'])
def return_question_object(questionnaireID, questionID):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire.questionnaire_id, includes.questionnaire_id,
    question.question_id, answer_options.question_id, question_text, question_required, question_type, 
    option_id, option_text, next_question_id FROM questionnaire INNER JOIN includes ON questionnaire.questionnaire_id=includes.questionnaire_id 
    INNER JOIN question ON question.question_id=includes.question_id
    INNER JOIN answer_options ON question.question_id=answer_options.question_id
    WHERE question.question_id='{}' and questionnaire.questionnaire_id='{}'
    ORDER BY question.question_id;""".format(questionID, questionnaireID))
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        cur.close()
        content = {}
        for result in rv:
            content = {'optID': result['option_id'],
                       'opttxt': result['option_text'],
                       'nextqID': result['next_question_id']}
            details.append(content)
            content = {}
        content = {'questionnaireID': result['questionnaire_id'],
                   'qID': result['question_id'],
                   'qtext': result['question_text'],
                   'required': result['question_required'],
                   'type': result['question_type'],
                   'options': details}
        return jsonify(content), 200


# sends the answer to a question
@app.route(f"{PREFIX}/doanswer/<questionnaireID>/<questionID>/<session>/<optionID>", methods=['POST', 'GET'])
def log_answer(questionnaireID, questionID, session, optionID):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT filled_questionnaire_id FROM filled_questionnaire 
    WHERE filled_questionnaire_id='{}';""".format(session))
    rv = cur.fetchall()
    if not rv:
        cur.execute("""INSERT INTO filled_questionnaire(filled_questionnaire_id,questionnaire_id) 
        VALUES ('{}','{}');""".format(session, questionnaireID))
    else:
        {}
    answer_id = questionID + session + questionnaireID
    cur.execute("""SELECT option_text, option_id, question_id FROM answer_options 
    WHERE option_id ='{}' AND question_id='{}';""".format(optionID, questionID))
    rv = cur.fetchall()
    if not rv:
        raise NoData
    content = {}
    for result in rv:
        option_text = result['option_text']
        cur.execute("""INSERT INTO answer (answer_id, option_id, question_id, questionnaire_id, filled_questionnaire_id,answer_text) 
        VALUES ('{}','{}','{}','{}','{}','{}');""".format(answer_id, optionID, questionID, questionnaireID, session,
                                                          option_text))
        mysql.connection.commit()
        return {"status": "OK"}, 200

# returns a session's answers to all the questions of a questionnaire
@app.route(f"{PREFIX}/getsessionanswers/<questionnaireID>/<session>", methods=['GET'])
def return_answered_questions(questionnaireID, session):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire_id,filled_questionnaire_id,question_id,answer_id
    FROM answer WHERE questionnaire_id='{}' AND filled_questionnaire_id='{}'
    ORDER BY question_id;""".format(questionnaireID, session))
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        cur.close()
        content = {}
        for result in rv:
            content = {'qID': result['question_id'], 'ans': result['answer_id']}
            details.append(content)
            content = {}
        content = {'questionnaireID': result['questionnaire_id'],
                   'session': result['filled_questionnaire_id'],
                   'answers': details}
        return jsonify(content), 200


# returns different answers given to the same question
@app.route(f"{PREFIX}/getquestionanswers/<questionnaireID>/<questionID>", methods=['GET'])
def return_answers(questionnaireID, questionID):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire_id,question_id,filled_questionnaire_id,answer_id
    FROM answer WHERE questionnaire_id='{}' AND question_id='{}'
    ORDER BY filled_questionnaire_id;""".format(questionnaireID, questionID))
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        cur.close()
        content = {}
        for result in rv:
            content = {'session': result['filled_questionnaire_id'],
                       'ans': result['answer_id']}
            details.append(content)
            content = {}
        content = {'questionnaireID': result['questionnaire_id'],
                   'questionID': result['question_id'],
                   'answers': details
                   }
        return jsonify(content), 200


# returns all questionnaires
@app.route(f"{PREFIX}/available_questionnaires", methods=['GET'])
def get_all_questionnaires():
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire_id, title FROM questionnaire ORDER BY questionnaire_id;""")
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        content = {}
        cur.close()
        for result in rv:
            content = {'questionnaireID': result['questionnaire_id'],
                       'title': result['title']
                       }
            details.append(content)
            content = {}
        return jsonify(details), 200


# returns data for the first question
@app.route(f"{PREFIX}/question/first_question/<questionnaireID>", methods=['GET'])
def get_first_question(questionnaireID):
    cur = mysql.connection.cursor()
    cur.execute("""SELECT questionnaire.questionnaire_id, includes.questionnaire_id,
    question.question_id FROM questionnaire INNER JOIN includes ON questionnaire.questionnaire_id=includes.questionnaire_id 
    INNER JOIN question ON question.question_id=includes.question_id
    WHERE questionnaire.questionnaire_id='{}' ORDER BY question.question_id ASC LIMIT 1;""".format(questionnaireID))
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        cur.close()
        for result in rv:
            questionnaireID = result['questionnaire_id']
            questionID = result['question_id']
        return return_question_object(questionnaireID, questionID)


# returns all sessions ids
@app.route(f"{PREFIX}/getsessionids", methods=['GET'])
def get_sessions():
    cur = mysql.connection.cursor()
    cur.execute("""SELECT filled_questionnaire_id, questionnaire_id 
    FROM filled_questionnaire ORDER BY filled_questionnaire_id;""")
    rv = cur.fetchall()
    if not rv:
        raise NoData
    else:
        details = []
        cur.close()
        content = {}
        for result in rv:
            content = {'session': result['filled_questionnaire_id'],
                       'questionnaireID': result['questionnaire_id']
                       }
            details.append(content)
        return jsonify(details), 200


# driver function
if __name__ == '__main__':
    app.run(debug=True, port=9103, host='localhost')
