####################################QUERES-ACTIONS OF USER AND ADMIN################################
#view all the existing questionnaires
SELECT * from questionnaire;
#view each question of the selected questionnaire
SELECT question_id,question_text,questionnaire_id,question_required,question_type from question inner join includes on question.question_id=includes.question_id inner join questionnaire on questionnaire.questionnaire_id=includes.questionnaire_id;
#view all options of each question
SELECT option_text from answer_options inner join question on question.question_id=answer_options.question_id;
####################################QUERES-ACTION OF ADMIN ONLY#####################################
#view answers of each question
SELECT filled_questionnaire_id,question_id, answer_text from answer inner join filled_questionnaire on (answer.filled_questionnaire_id=filled_questionnaire.filled_questionnaire_id and answer.questionnaire_id=filled_questionnaire.questionnaire_id) inner join question on answer.question_id=question.question_id;