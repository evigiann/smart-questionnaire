DROP SCHEMA IF EXISTS intelliq;
CREATE SCHEMA intelliq;
USE intelliq;

SET SQL_SAFE_UPDATES=0;


CREATE TABLE  question (
	question_id varchar(10) not null,
    question_text varchar(100) not null,
    question_required varchar(5),
    check (question_required = 'false' or question_required = 'true'),
    question_type varchar(10),
    check (question_type = 'question' or question_type = 'profile'),
    primary key (question_id)
    );

CREATE TABLE answer_options (
  option_id varchar(10) not null,
  question_id varchar(10) not null,
  option_text varchar(50) not null,
  next_question_id varchar(10) not null,
  primary key (option_id),
  foreign key (question_id) REFERENCES question(question_id)
  on delete cascade);

CREATE TABLE questionnaire (
	questionnaire_id varchar(10) not null,
    title varchar(50),
    primary key (questionnaire_id)
    );

CREATE TABLE keywords (
	keyword varchar(20) not null,
    questionnaire_id varchar(10) not null,
    primary key (keyword),
    foreign key (questionnaire_id) references questionnaire(questionnaire_id)
    );

CREATE TABLE filled_questionnaire (
	filled_questionnaire_id varchar(10) not null,
    questionnaire_id varchar(10) not null,
    primary key (filled_questionnaire_id),
    foreign key (questionnaire_id) references questionnaire(questionnaire_id)
    on delete cascade
   );

 CREATE TABLE includes (
    question_id varchar(10) not null,
	questionnaire_id varchar(10) not null,
	foreign key (question_id) references question(question_id)
    on delete cascade,
    foreign key (questionnaire_id) references questionnaire(questionnaire_id)
    on delete cascade
    );

 CREATE TABLE answer (
	answer_id varchar(30) not null,
    question_id varchar(10) not null,
    option_id varchar(10) not null,
    questionnaire_id varchar(10) not null,
	filled_questionnaire_id varchar(10) not null,
    answer_text varchar(50),
	primary key (answer_id),
    foreign key (question_id) references question(question_id)
    on delete cascade,
    foreign key (option_id) references answer_options(option_id)
    on delete cascade,
    foreign key (questionnaire_id) references questionnaire(questionnaire_id)
    on delete cascade,
	foreign key (filled_questionnaire_id) references filled_questionnaire(filled_questionnaire_id)
    on delete cascade);