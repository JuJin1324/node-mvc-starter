/* insert queries */

INSERT INTO DEV_USER(USER_ID, NAME, PHONE, EMAIL, STATUS, COMMENT, DEL_FLAG, UPD_USER_KEY)
VALUE ('test1', '홍길동', '010-1234-1234', 'test1@gmail.com', 'A', null, 'N', 1);
INSERT INTO DEV_USER(USER_ID, NAME, PHONE, EMAIL, STATUS, COMMENT, DEL_FLAG, UPD_USER_KEY)
VALUE ('test2', '홍두깨', '010-4321-4321', 'test2@gmail.com', 'A', null, 'N', 1);
COMMIT;

INSERT INTO DEV_PASSWORD(PASSWORD, PWD_STATUS, DEL_FLAG, UPD_USER_KEY)
VALUE ('$2a$08$WYoceJIWZqK75uUFhZ81rO/O7FX8wIfcCxpJW.qci3iV/2C2gDvTC', 'I', 'N', 1);    /* password: 1234 */
INSERT INTO DEV_PASSWORD(PASSWORD, PWD_STATUS, DEL_FLAG, UPD_USER_KEY)
VALUE ('$2a$08$WYoceJIWZqK75uUFhZ81rO/O7FX8wIfcCxpJW.qci3iV/2C2gDvTC', 'I', 'N', 2);    /* password: 1234 */
COMMIT;

INSERT INTO DEV_COMMENTS (TITLE, CONTENT, DEL_FLAG, UPD_USER_KEY, INPUT_TIME)
VALUES ('test title1', 'test content1', 'N', 1, NOW());
INSERT INTO DEV_COMMENTS (TITLE, CONTENT, DEL_FLAG, UPD_USER_KEY, INPUT_TIME)
VALUES ('한글 타이틀1', '한글 컨텐트1', 'N', 2, NOW());
COMMIT;