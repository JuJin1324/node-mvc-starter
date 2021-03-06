# node-mvc-start
> Nodejs MVC Pattern 을 사용한 프로젝트 생성 샘플

## 스펙
> Base language: nodeJS  
> Framework: express 4  
> DataBase: MariaDB 10.5.9 (Docker)  
> View Engine: Handlebars  
> Logger: morgan  

## 준비
### express generator 설치
> ```shell
> npm i -g express
> npm i -g express-generator
> ```

## 프로젝트 생성
### express 프로젝트 생성
> express 프로젝트 기본 구조 생성: `express --hbs --git`  
> * --hbs: view 엔진으로 기본 값인 Jade 대신 handlebars 엔진을 사용한다.
> * --git: .gitignore 파일을 프로젝트에 추가한다.

### npm 모듈 다운로드
> 실행에 필요한 모듈 다운로드: `npm i`

### Database
> Docker 로 MariaDB 실행:
> ```shell
> # 프로젝트 디렉터리로 이동 후 진행
> cd docker
> docker-compose up
> ```  

## 사용 모듈
### winston
> logging 모듈
> 설치: `npm i winston`
> 참조사이트: [NodeJS 인기있는 Logging 모듈 Winston](https://basketdeveloper.tistory.com/42)
> 참조사이트: [winston-logging-starter](https://github.com/JuJin1324/winston-logging-starter)

### compression
> response content 를 client 에 돌려줄 때 gzip 을 통해서 압축하여 돌려주도록 하는 middleware  
> 설치: `npm i compression`  
> 사용: 모든 url 에 대하여 default 설정의 gzip compress 적용
> ```javascript
> const compression = require('compression');
> app.use(compression(null));
> ```  
> 커스텀 설정이 필요할 시 참조 사이트: [링크](https://github.com/expressjs/compression)

### connect-flash
> 사용자 친화적인 메시지 출력  
> 설치: `npm i connect-flash`  

### express-session
> 서버에서 저장하는 세션 정보 사용을 위한 middleware  
> 설치: `npm i express-session`  
> 사용: req 에만 session 이 존재하게 되면 res 에는 session 이 없다.
> ```javascript
> let session = require('express-session');
> app.use(session({
>     secret: credentials.cookieSecret,
>     proxy: true,
>     resave: true,
>     saveUninitialized: true
> }));
> 
> app.use((req, res, next) => {
>     res.locals.flash = req.session.flash;
>     delete req.session.flash;
>     next();
> });
> ```

### mariadb
> mariadb 클라이언트 모듈    
> 현재 프로젝트에서 session 및 model 저장 용도로 사용    
> 설치: `npm i mariadb`  

### bcrypt-nodejs
> 패스워드 암호화용 모듈  
> 설치: `npm i bcrypt-nodejs`

### passport / passport-local
> 로그인 미들웨어  
> 로그인에는 OAuth 및 자체 로그인(passport-local) 기능 제공  
> 설치: `npm i passport passport-local`  

 
