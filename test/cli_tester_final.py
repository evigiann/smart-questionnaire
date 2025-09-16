import subprocess
import os
import json
from pathlib import Path

# Normalize output for comparison across platforms
def normalize_output(output):
    return output.decode('utf-8').replace('\r\n', '\n').replace('\r', '\n').strip()

def capture(command):
    proc = subprocess.Popen(command,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            )
    out, err = proc.communicate()
    return out, err, proc.returncode

def parse_json_response(normalized_out):
    """Helper function to parse JSON response safely"""
    try:
        return json.loads(normalized_out.replace("'", '"'))
    except json.JSONDecodeError:
        # If it's not valid JSON, return None
        return None

def test_resetall():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "resetall", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    if response_data and response_data.get('status') == 'OK':
        print("clearing data from the database")
        assert True
    else:
        print(f"Unexpected resetall output: {normalized_out}")
        assert False

def test_healthcheck():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "healthcheck", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    if (response_data and 
        response_data.get('status') == 'OK' and 
        response_data.get('dbconnection') == 'the database is now connected'):
        assert True
        print("the db is connected")
    elif (response_data and 
          response_data.get('status') == 'failed' and 
          response_data.get('dbconnection') == 'there has been some mistake in the connection of the database'):
        print("there is something wrong with the database")
        assert False
    else:
        print(f"Unexpected healthcheck output: {normalized_out}")
        assert False

def test_questionnaire_uploading():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "questionnaire_upd", "--source", "./testing_questionnaire.json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)

    if normalized_out == "":
        command = ["python3", "../cli/cli_final.py", "available_questionnaires", "--format", "json"]
        out, err, exitcode = capture(command)
        normalized_out = normalize_output(out)
        assert True
        print("the test questionnaire has been uploaded")
    else:
        print("there has been some problem with the questionnaire uploading")
        print(out)
        assert False

def test_questionnaire():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "questionnaire", "--questionnaire_id", "3", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    expected_keys = ['questionnaireID', 'questionnaireTitle', 'keywords', 'questions']
    
    if (response_data and 
        all(key in response_data for key in expected_keys) and
        response_data.get('questionnaireID') == '3' and
        response_data.get('questionnaireTitle') == 'Dummy Questionnaire for testing' and
        'dummy' in response_data.get('keywords', []) and
        'testing' in response_data.get('keywords', []) and
        len(response_data.get('questions', [])) > 0):
        print("the questionnaire was returned correctly")
        assert True
    else:
        print(f"Unexpected questionnaire output: {normalized_out}")
        assert False

def test_question_one():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "question", "--questionnaire_id", "3", "--question_id", "Dummy1", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    expected_keys = ['questionnaireID', 'qID', 'qtext', 'required', 'type', 'options']
    
    if (response_data and 
        all(key in response_data for key in expected_keys) and
        response_data.get('questionnaireID') == '3' and
        response_data.get('qID') == 'Dummy1' and
        response_data.get('qtext') == 'How old are you?' and
        response_data.get('required') == 'TRUE' and
        response_data.get('type') == 'profile' and
        len(response_data.get('options', [])) > 0):
        print("first question was returned correctly")
        assert True
    else:
        print(f"Unexpected question output: {normalized_out}")
        assert False

def test_question_two():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "question", "--questionnaire_id", "3", "--question_id", "Dummy2", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    expected_keys = ['questionnaireID', 'qID', 'qtext', 'required', 'type', 'options']
    
    if (response_data and 
        all(key in response_data for key in expected_keys) and
        response_data.get('questionnaireID') == '3' and
        response_data.get('qID') == 'Dummy2' and
        response_data.get('qtext') == 'What is your favourite colour?' and
        response_data.get('required') == 'TRUE' and
        response_data.get('type') == 'question' and
        len(response_data.get('options', [])) > 0):
        print("second question was returned correctly")
        assert True
    else:
        print(f"Unexpected question output: {normalized_out}")
        assert False

def test_doanswer_one():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "doanswer", "--questionnaire_id", "3", "--question_id", "Dummy1", "--session_id", "1", "--option", "D1opt1"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    if normalized_out == '':
        print("first option was chosen from first question")
        assert True
    else:
        print(f"Unexpected doanswer output: {normalized_out}")
        assert False

def test_doanswer_two():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "doanswer", "--questionnaire_id", "3", "--question_id", "Dummy2", "--session_id", "2", "--option", "D2opt1"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    if normalized_out == '':
        print("second option was chosen from second question")
        assert True
    else:
        print(f"Unexpected doanswer output: {normalized_out}")
        assert False

def test_getsessionanswers():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getsessionanswers", "--questionnaire_id", "3", "--session_id", "1", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    expected_keys = ['questionnaireID', 'session', 'answers']
    
    if (response_data and 
        all(key in response_data for key in expected_keys) and
        response_data.get('questionnaireID') == '3' and
        response_data.get('session') == '1' and
        len(response_data.get('answers', [])) > 0):
        print("answer to question 1 was indeed registered")
        assert True
    else:
        print(f"Unexpected session answers: {normalized_out}")
        assert False

def test_getquestionanswers():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getquestionanswers", "--questionnaire_id", "3", "--question_id", "Dummy2", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    expected_keys = ['questionnaireID', 'questionID', 'answers']
    
    if (response_data and 
        all(key in response_data for key in expected_keys) and
        response_data.get('questionnaireID') == '3' and
        response_data.get('questionID') == 'Dummy2' and
        len(response_data.get('answers', [])) > 0):
        print("answer to question 2 was indeed registered")
        assert True
    else:
        print(f"Unexpected question answers: {normalized_out}")
        assert False

def test_resetq():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "resetq", "--questionnaire_id", "3", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    if response_data and response_data.get('status') == 'OK':
        print("delete answers to questionnaire 3")
        assert True
    else:
        print(f"Unexpected resetq output: {normalized_out}")
        assert False

def test_getsessionanswers_after_deletion():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getsessionanswers", "--questionnaire_id", "3", "--session_id", "1", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    if (response_data and 
        response_data.get('error') == 402 and 
        response_data.get('message') == 'The call returned with no data'):
        print("answer to question 1 was indeed deleted")
        assert True
    else:
        print(f"Unexpected session answers after deletion: {normalized_out}")
        assert False

def test_getquestionanswers_after_deletion():
    home = str(Path.home())
    command = ["python3", "../cli/cli_final.py", "getquestionanswers", "--questionnaire_id", "3", "--question_id", "Dummy2", "--format", "json"]
    out, err, exitcode = capture(command)
    normalized_out = normalize_output(out)
    
    response_data = parse_json_response(normalized_out)
    if (response_data and 
        response_data.get('error') == 402 and 
        response_data.get('message') == 'The call returned with no data'):
        print("answer to question 2 was indeed deleted")
        assert True
    else:
        print(f"Unexpected question answers after deletion: {normalized_out}")
        assert False

# Run the tests
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