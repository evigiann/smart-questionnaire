import subprocess
import os
from pathlib import Path


def capture(command):
    proc = subprocess.Popen(command,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            )
    out, err = proc.communicate()
    return out, err, proc.returncode


def test_resetall():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "resetall", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'status': 'OK'}\n":
        print("clearing data from the database")
        assert True
    else:
        print(out)
        assert False


def test_healthcheck():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "healthcheck", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'status': 'OK', 'dbconnection': 'the database is now connected'}\n":
        assert True
        print("the db is connected")
    elif out == {"status": "failed", "dbconnection": "there has been some mistake in the connection of the database"}:
        print("there is something wrong with the database")
        assert False
    else:
        # print(out)
        assert False


def test_questionnaire_uploading():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "questionnaire_upd", "--source", "./testing_questionnaire.json"]
    out, err, exitcode = capture(command)
    if out == b'':
        assert True
        print("the test questionnaire has been uploaded")
    else:
        print("there has been some problem with the questionnaire uploading")
        print(out)
        assert False


def test_questionnaire():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "questionnaire", "--questionnaire_id", "3",
               "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'questionnaireID': '3', 'questionnaireTitle': 'Dummy Questionnaire for testing', 'keywords': [" \
              b"'dummy', 'testing'], 'questions': [{'qID': 'Dummy1', 'qtext': 'How old are you?', 'required': 'TRUE', " \
              b"'type': 'profile'}, {'qID': 'Dummy10', 'qtext': 'Do you prefer summer or winter time?', 'required': " \
              b"'FALSE', 'type': 'question'}, {'qID': 'Dummy2', 'qtext': 'What is your favourite colour?', " \
              b"'required': 'TRUE', 'type': 'question'}, {'qID': 'Dummy3', 'qtext': 'Do you like soccer?', " \
              b"'required': 'TRUE', 'type': 'question'}, {'qID': 'Dummy4', 'qtext': 'Which football club do you " \
              b"support?', 'required': 'FALSE', 'type': 'question'}, {'qID': 'Dummy5', 'qtext': 'Have you ever lived " \
              b"in an island?', 'required': 'TRUE', 'type': 'question'}, {'qID': 'Dummy6', 'qtext': 'Are you a winter " \
              b"swimmer?', 'required': 'TRUE', 'type': 'question'}, {'qID': 'Dummy7', 'qtext': 'How would you " \
              b"describe your relationship with water skiing?', 'required': 'FALSE', 'type': 'question'}, " \
              b"{'qID': 'Dummy8', 'qtext': 'Do you go winter skiing?', 'required': 'TRUE', 'type': 'question'}, " \
              b"{'qID': 'Dummy9', 'qtext': 'Do you agree with the changing of standard clock time?', 'required': " \
              b"'TRUE', 'type': 'question'}]}\n":
        print("the questionnaire was returned correctly")
        assert True
    else:
        # print(out)
        assert False


def test_question_one():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "question", "--questionnaire_id", "3", "--question_id", "Dummy1",
               "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'questionnaireID': '3', 'qID': 'Dummy1', 'qtext': 'How old are you?', 'required': 'TRUE', " \
              b"'type': 'profile', 'options': [{'optID': 'D1opt1', 'opttxt': '<30', 'nextqID': 'Dummy2'}, " \
              b"{'optID': 'D1opt2', 'opttxt': '30-50', 'nextqID': 'Dummy2'}, {'optID': 'D1opt3', 'opttxt': '50-70', " \
              b"'nextqID': 'Dummy2'}, {'optID': 'D1opt4', 'opttxt': '>70', 'nextqID': 'Dummy2'}]}\n":
        print("first question was returned correctly")
        assert True
    else:
        # print(out)
        assert False


def test_question_two():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "question", "--questionnaire_id", "3", "--question_id", "Dummy2",
               "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'questionnaireID': '3', 'qID': 'Dummy2', 'qtext': 'What is your favourite colour?', 'required': " \
              b"'TRUE', 'type': 'question', 'options': [{'optID': 'D2opt1', 'opttxt': 'yellow', 'nextqID': 'Dummy3'}, " \
              b"{'optID': 'D2opt2', 'opttxt': 'green', 'nextqID': 'Dummy3'}, {'optID': 'D2opt3', 'opttxt': 'blue', " \
              b"'nextqID': 'Dummy3'}]}\n":
        print("second question was returned correctly")
        assert True
    else:
        print(out)
        assert False


def test_doanswer_one():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "doanswer", "--questionnaire_id", "3", "--question_id", "Dummy1",
               "--session_id", "1", "--option", "D1opt1"]
    out, err, exitcode = capture(command)
    if out == b'':
        print("first option was chosen from first question")
        assert True
    else:
        assert False


def test_doanswer_two():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "doanswer", "--questionnaire_id", "3", "--question_id", "Dummy2",
               "--session_id", "2", "--option", "D2opt1"]
    out, err, exitcode = capture(command)
    if out == b'':
        print("second option was chosen from second question")
        assert True
    else:
        assert False


def test_getsessionanswers():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getsessionanswers", "--questionnaire_id", "3", "--session_id",
               "1", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'questionnaireID': '3', 'session': '1', 'answers': [{'qID': 'Dummy1', 'ans': 'Dummy113'}]}\n":
        print("answer to question 1 was indeed registered")
        assert True
    else:
        print(out)
        assert False


def test_getquestionanswers():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getquestionanswers", "--questionnaire_id", "3", "--question_id",
               "Dummy2", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'questionnaireID': '3', 'questionID': 'Dummy2', 'answers': [{'session': '2', 'ans': 'Dummy223'}]}\n":
        print("answer to question 2 was indeed registered")
        assert True
    else:
        print(out)
        assert False


def test_resetq():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "resetq", "--questionnaire_id", "3","--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'status': 'OK'}\n":
        print("delete answers to questionnaire 3")
        assert True
    else:
        print(out)
        assert False


def test_getsessionanswers_after_deletion():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getsessionanswers", "--questionnaire_id", "3", "--session_id",
               "1", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'error': 402, 'message': 'The call returned with no data'}\n":
        print("answer to question 1 was indeed deleted")
        assert True
    else:
        print(out)
        assert False


def test_getquestionanswers_after_deletion():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getquestionanswers", "--questionnaire_id", "3", "--question_id",
               "Dummy2", "--format", "json"]
    out, err, exitcode = capture(command)
    if out == b"{'error': 402, 'message': 'The call returned with no data'}\n":
        print("answer to question 2 was indeed deleted")
        assert True
    else:
        print(out)
        assert False


test_resetall()
test_healthcheck()
test_questionnaire_uploading()
test_questionnaire()
test_question_one()
test_question_two()
test_doanswer_one()
test_doanswer_two()
test_getsessionanswers()
test_getquestionanswers()
test_resetq()
test_getsessionanswers_after_deletion()
test_getquestionanswers_after_deletion()
print("all went well")

