import argparse
import json
import requests
import pandas as pd
from flask import jsonify

parser = argparse.ArgumentParser(description='A CLI for the interaction with an API')

subparsers = parser.add_subparsers(dest='scope', help='Available scopes')

# healthcheck
healthcheck_parser = subparsers.add_parser('healthcheck', help='Check API health')
healthcheck_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

# resetall
resetall_parser = subparsers.add_parser('resetall', help='Reset all questionnaire data')
resetall_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

# questionnaire_upd
questionnaire_upd_parser = subparsers.add_parser('questionnaire_upd', help='Insert data')
questionnaire_upd_parser.add_argument('--source', type=argparse.FileType('r'), help='Path to the JSON file')

# resetq
resetq_parser = subparsers.add_parser('resetq', help='Reset Questionnaire')
resetq_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
resetq_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

# questionnaire
questionnaire_parser = subparsers.add_parser('questionnaire', help='Get questionnaire')
questionnaire_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
questionnaire_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

# question
question_parser = subparsers.add_parser('question', help='Get question')
question_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
question_parser.add_argument('--question_id', type=str, required=True, help='Question id')
question_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

# doanswer
doanswer_parser = subparsers.add_parser('doanswer', help='doanswer')
doanswer_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
doanswer_parser.add_argument('--question_id', type=str, required=True, help='Question id')
doanswer_parser.add_argument('--session_id', type=str, required=True, help='Session id')
doanswer_parser.add_argument('--option_id', type=str, required=True, help='Option id')

# getsessionanswers
getsessionanswers_parser = subparsers.add_parser('getsessionanswers', help='getsessionanswers')
getsessionanswers_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
getsessionanswers_parser.add_argument('--session_id', type=str, required=True, help='Session id')
getsessionanswers_parser.add_argument('--format', type=str, required=True, help='Format of the response, json or csv')

# getquestionanswers
getquestionanswers_parser = subparsers.add_parser('getquestionanswers', help='getquestionanswers')
getquestionanswers_parser.add_argument('--questionnaire_id', type=str, required=True, help='Questionnaire id')
getquestionanswers_parser.add_argument('--question_id', type=str, required=True, help='Question id')
getquestionanswers_parser.add_argument('--format', type=str, required=True, help='Format of the response: json or csv')

args = parser.parse_args()
# healthcheck
if args.scope == 'healthcheck':
    response = requests.get('http://localhost:9103/intelliq_api/admin/healthcheck')
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
# resetall
elif args.scope == 'resetall':
    response = requests.get('http://localhost:9103/intelliq_api/admin/resetall')
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
# questionnaire_udp
elif args.scope == 'questionnaire_upd':
    filename = args.source
    filedata = open(str(filename)[25:-28], 'r') # opens it
    content = json.load(filedata) # loads it into a dictionary
    json_object = json.dumps(content, indent=4) # makes it a json again
    response = requests.post('http://localhost:9103/intelliq_api/admin/questionnaire_upd', json=json_object)
# resetq
elif args.scope == 'resetq':
    url = 'http://localhost:9103/intelliq_api/admin/resetq/{}'.format(args.questionnaire_id)
    response = requests.post(url)
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
# questionnaire
elif args.scope == 'questionnaire':
    url = 'http://localhost:9103/intelliq_api/questionnaire/{}'.format(args.questionnaire_id)
    response = requests.get(url)
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
# question
elif args.scope == 'question':
    url = 'http://localhost:9103/intelliq_api/question/{}/{}'.format(args.questionnaire_id, args.question_id)
    response = requests.get(url)
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
# doanswer
elif args.scope == 'doanswer':
    questionnaire_id = args.questionnaire_id
    question_id = args.question_id
    session_id = args.session_id
    option_id = args.option_id
    url = 'http://localhost:9103/intelliq_api/doanswer/{}/{}/{}/{}'.format(questionnaire_id, question_id, session_id, option_id)
    response = requests.post(url)
# getsessionanswers
elif args.scope == 'getsessionanswers':
    url = 'http://localhost:9103/intelliq_api/getsessionanswers/{}/{}'.format(args.questionnaire_id, args.session_id)
    response = requests.get(url)
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
elif args.scope == 'getquestionanswers':
    url = 'http://localhost:9103/intelliq_api/getquestionanswers/{}/{}'.format(args.questionnaire_id, args.question_id)
    response = requests.get(url)
    if args.format == 'json':
        print(response.json())
    elif args.format == 'csv':
        df = pd.json_normalize(response.json())
        df.to_csv()
        print(df)
    else:
        print("Invalid format")
else:
    print("Invalid scope")
