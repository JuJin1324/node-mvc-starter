-- You can reference from https://joke00.tistory.com/176
UPDATE sys.props$ SET value$='KO16MSWIN949' WHERE name='NLS_CHARACTERSET';
UPDATE sys.props$ SET value$='KO16MSWIN949' WHERE name='NLS_NCHAR_CHARACTERSET';
COMMIT;
SHUTDOWN IMMEDIATE;

STARTUP MOUNT;
ALTER SYSTEM ENABLE RESTRICTED SESSION;
ALTER SYSTEM SET JOB_QUEUE_PROCESSES=0;
ALTER DATABASE OPEN;
ALTER DATABASE CHARACTER SET INTERNAL_USE KO16MSWIN949;
SHUTDOWN IMMEDIATE;

STARTUP;

-- time-zone: Asia/Seoul 로 변경
ALTER SESSION SET TIME_ZONE = '+09:00';

-- You can reference from https://m.blog.naver.com/PostView.nhn?blogId=youngram2&logNo=220963218066&proxyReferer=https:%2F%2Fwww.google.com%2F
-- ALTER DATABASE DATAFILE '/U01/APP/ORACLE/ORADATA/XE/SYSTEM.DBF' RESIZE 2000M;

-- 작업 저장용 스키마 생성
CREATE TABLESPACE DEV_DAT DATAFILE 'dev_dat.dbf' size 500M;
CREATE TABLESPACE DEV_IDX DATAFILE 'dev_idx.dbf' size 50M;
CREATE USER scott identified by "tiger" DEFAULT TABLESPACE DEV_DAT;
GRANT CONNECT, DBA, RESOURCE TO scott;

-- START USER TABLE
CREATE TABLE SCOTT.DEV_USER
(
    USER_KEY     NUMBER       NOT NULL,
    USER_ID      VARCHAR2(50) NOT NULL,
    USER_NAME    VARCHAR2(30) NOT NULL,
    USER_PHONE   VARCHAR2(20),
    USER_EMAIL   VARCHAR2(60),
    USER_STATUS  CHAR(1)      NOT NULL,
    USER_COMMENT VARCHAR2(4000),
    DEL_FLAG     CHAR(1)      NOT NULL,
    UPD_USER_KEY NUMBER,
    INPUT_TIME   TIMESTAMP(6) NOT NULL
) TABLESPACE DEV_DAT;

CREATE UNIQUE INDEX SCOTT.DEV_USER_PK ON SCOTT.DEV_USER (USER_KEY) TABLESPACE DEV_IDX;
CREATE UNIQUE INDEX SCOTT.DEV_USER_UK_01 ON SCOTT.DEV_USER (USER_ID) TABLESPACE DEV_IDX;
CREATE INDEX SCOTT.DEV_USER_IX_01 ON SCOTT.DEV_USER (USER_EMAIL) TABLESPACE DEV_IDX;

ALTER TABLE SCOTT.DEV_USER ADD (CONSTRAINT DEV_USER_PK PRIMARY KEY (USER_KEY) USING INDEX SCOTT.DEV_USER_PK);

COMMENT ON TABLE SCOTT.DEV_USER IS '테이블 설명을 작성한다.';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_KEY IS '사용자 키';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_ID IS '사용자 아이디';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_NAME IS '사용자 이름';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_PHONE IS '연락처';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_EMAIL IS '이메일';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_STATUS IS '계정 상태 (A:Active, I:Inactive)';
COMMENT ON COLUMN SCOTT.DEV_USER.USER_COMMENT IS '메모';
COMMENT ON COLUMN SCOTT.DEV_USER.DEL_FLAG IS '삭제 유무 (Y|N)';
COMMENT ON COLUMN SCOTT.DEV_USER.UPD_USER_KEY IS '입력/변경 사용자 Key';
COMMENT ON COLUMN SCOTT.DEV_USER.INPUT_TIME IS '입력/변경 시간';

CREATE SEQUENCE SCOTT.SEQ_USER_KEY
    START WITH 1
    MAXVALUE 9999999999
    MINVALUE 1
    NOCYCLE
    NOCACHE
;
-- END USER TABLE

-- START PASSWORD TABLE
CREATE TABLE SCOTT.DEV_PASSWORD
(
    USER_KEY     NUMBER        NOT NULL,
    PASSWORD     VARCHAR2(256) NOT NULL,
    PWD_STATUS   CHAR(1)       NOT NULL,
    DEL_FLAG     CHAR(1)       NOT NULL,
    UPD_USER_KEY NUMBER,
    INPUT_TIME   TIMESTAMP(6)  NOT NULL
) TABLESPACE DEV_DAT;

CREATE UNIQUE INDEX SCOTT.DEV_PASSWORD_PK ON SCOTT.DEV_PASSWORD (USER_KEY) TABLESPACE DEV_IDX;

ALTER TABLE SCOTT.DEV_PASSWORD ADD (CONSTRAINT DEV_PASSWORD_PK PRIMARY KEY (USER_KEY) USING INDEX SCOTT.DEV_PASSWORD_PK);
ALTER TABLE SCOTT.DEV_PASSWORD ADD CONSTRAINT PASSWORD_USER_KEY_FK FOREIGN KEY (USER_KEY) REFERENCES SCOTT.DEV_USER(USER_KEY) ON DELETE CASCADE;

COMMENT ON TABLE SCOTT.DEV_PASSWORD IS '테이블 설명을 작성한다.';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.USER_KEY IS '사용자 키';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.PASSWORD IS '암호화된 비밀번호';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.PWD_STATUS IS '비밀번호 상태 (I:Initial, C:Changed)';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.DEL_FLAG IS '삭제 유무 (Y|N)';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.UPD_USER_KEY IS '입력/변경 사용자 Key';
COMMENT ON COLUMN SCOTT.DEV_PASSWORD.INPUT_TIME IS '입력/변경 시간';
-- END PASSWORD TABLE

COMMIT;
