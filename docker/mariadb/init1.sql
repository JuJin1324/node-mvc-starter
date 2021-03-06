SET TIME_ZONE='Asia/Seoul';

-- START USER TABLE
CREATE TABLE DEV_USER
(
    USER_KEY     INT          NOT NULL AUTO_INCREMENT COMMENT '사용자 키',
    USER_ID      VARCHAR(256) NOT NULL COMMENT '사용자 아이디',
    NAME         VARCHAR(30)  NOT NULL COMMENT '사용자 이름',
    PHONE        VARCHAR(20) COMMENT '연락처',
    EMAIL        VARCHAR(60) COMMENT '이메일',
    STATUS       CHAR(1) COMMENT '계정 상태 (A: Active, I: Inactive)',
    COMMENT      VARCHAR(2000) COMMENT '메모',
    DEL_FLAG     CHAR(1)      NOT NULL COMMENT '삭제 유무 (Y|N)',
    UPD_USER_KEY INT COMMENT '입력/변경 사용자 Key',
    INPUT_TIME   TIMESTAMP(6) NOT NULL COMMENT '입력/변경 시간',
    CONSTRAINT MST_MESSAGE_PK PRIMARY KEY (USER_KEY)
) COLLATE = 'UTF8MB4_GENERAL_CI'
  ENGINE = InnoDB;

CREATE UNIQUE INDEX DEV_USER_PK ON DEV_USER (USER_KEY);
CREATE UNIQUE INDEX DEV_USER_UK_01 ON DEV_USER (USER_ID);
CREATE INDEX DEV_USER_IX_01 ON DEV_USER (EMAIL);
-- END USER TABLE
COMMIT;

-- START PASSWORD TABLE
CREATE TABLE DEV_PASSWORD
(
    USER_KEY     INT          NOT NULL AUTO_INCREMENT COMMENT '사용자 키',
    PASSWORD     VARCHAR(256) NOT NULL COMMENT '암호화된 비밀번호',
    PWD_STATUS   CHAR(1)      NOT NULL COMMENT '비밀번호 상태 (I:Initial, C:Changed)',
    DEL_FLAG     CHAR(1)      NOT NULL COMMENT '삭제 유무 (Y|N)',
    UPD_USER_KEY INT COMMENT '입력/변경 사용자 Key',
    INPUT_TIME   TIMESTAMP(6) NOT NULL COMMENT '입력/변경 시간',
    CONSTRAINT MST_MESSAGE_PK PRIMARY KEY (USER_KEY)
) COLLATE = 'UTF8MB4_GENERAL_CI'
  ENGINE = InnoDB;

CREATE UNIQUE INDEX DEV_PASSWORD_PK ON DEV_PASSWORD (USER_KEY);
-- END PASSWORD TABLE
COMMIT;

-- START SESSION TABLE
-- 주의: express-session-mariadb-store 모듈을 사용해서 mariadb 를 세션으로 사용 시에
-- 해당 테이블의 column 명이 소문자로 되어있어야 정상 동작한다.
CREATE TABLE EXPRESS_SESSION(
    sid      VARCHAR(100) PRIMARY KEY NOT NULL,
    session  VARCHAR(2048) DEFAULT '{}',
    lastseen DATETIME DEFAULT NOW()
) COLLATE = 'UTF8MB4_GENERAL_CI'
  ENGINE = InnoDB;
-- END SESSION TABLE
COMMIT;

-- START DEV_COMMENTS TABLE
CREATE TABLE DEV_COMMENTS
(
    COMMENTS_KEY INT          NOT NULL AUTO_INCREMENT COMMENT '커맨트 키',
    TITLE        VARCHAR(300) NOT NULL COMMENT '제목',
    CONTENT      VARCHAR(2000) COMMENT '컨텐츠',
    DEL_FLAG     CHAR(1)      NOT NULL COMMENT '삭제 유무 (Y|N)',
    UPD_USER_KEY INT COMMENT '입력/변경 사용자 Key',
    INPUT_TIME   TIMESTAMP(6) NOT NULL COMMENT '입력/변경 시간',
    CONSTRAINT MST_MESSAGE_PK PRIMARY KEY (COMMENTS_KEY)
) COLLATE = 'UTF8MB4_GENERAL_CI'
  ENGINE = InnoDB;

CREATE UNIQUE INDEX DEV_COMMENTS_PK ON DEV_COMMENTS (COMMENTS_KEY);

-- END DEV_COMMENTS TABLE
COMMIT;
