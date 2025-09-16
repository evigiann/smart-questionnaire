#2
insert into questionnaire (questionnaire_id,title) values ('{}','{}');
insert into question (question_id,question_text,question_required, question_type) values ('{}','{}','{}','{}');
insert into answer_options (option_id,question_id,option_text) values ('{}','{}','{}');
insert into filled_questionnaire (filled_questionnaire_id,questionnaire_id) values ('{}','{}');
insert into includes (question_id, questionnaire_id) values ('{}','{}');
insert into answer (answer_id, option_id, question_id, questionnaire_id, filled_questionnaire_id,answer_text) values ('{}','{}','{}','{}','{}','{}');
#4
DELETE FROM filled_questionnaire WHERE questionnaire_id='{}';
#a
SELECT questionnaire_id,title,question_id,question_text,question_required,question_type
FROM questionnaire INNER JOIN includes ON questionnaire.questionnaire_id=includes.questionnaire_id INNER JOIN question ON question.question_id=includes.question_id
WHERE questionnaire_id='{}'
ORDER BY question_id;
#b
SELECT questionnaire_id,question_id,question_text,question_required,question_type,option_id,option_text
FROM questionnaire INNER JOIN includes ON questionnaire.questionnaire_id=includes.questionnaire_id INNER JOIN question ON question.question_id=includes.question_id
WHERE question_id='{}' and questionnaire_id='{}'
ORDER BY question_id;
#c
INSERT INTO answer(questionnaire_id,qestion_id,filled_questionnaire_id,option_id)
VALUES ('{}','{}','{}','{}');
#d
SELECT questionnaire_id,filled_questionnaire_id,question_id,answer_id
FROM answer
WHERE questionnaire_id='{}' AND filled_questionnaire_id='{}'
ORDER BY question_id;
#e
SELECT questionnaire_id,question_id,filled_questionnaire_id,answer_id
FROM answer WHERE questionnaire_id='{}' AND question_id'{}'
ORDER BY filled_questionnaire_id;
