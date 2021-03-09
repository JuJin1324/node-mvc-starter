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
> 현업에서 많이 사용하는 패스워드 암호화 알고리즘, 기본적으로 salt 를 추가하여 해싱하기 때문에 
> 오래 전부터 많이 사용하는 SHA256이나 SHA512 보다 보안성이 높다는 평가.
> salt 는 보통 10번 돌린다.  
> 설치: `npm i bcrypt-nodejs`

### passport / passport-local
> 로그인 미들웨어  
> 로그인에는 OAuth 및 자체 로그인(passport-local) 기능 제공  
> 현재 프로젝트에서는 회원 가입(signup) 및 로그인 기능으로 사용  
> 설치: `npm i passport passport-local`    
>
> 정의: server/config/passport.js
> ```javascript
> /* 로그인에 사용할 LocalStrategy 정의 */
> passport.use('local-login', new LocalStrategy({
>     usernameField: 'userId',          /* view 의 form 에서 ID 로 사용하는 input 태그의 name 속성 값 */
>     passwordField: 'userPassword',    /* view 의 form 에서 Password 로 사용하는 input 태그의 name 속성 값 */
>     passReqToCallback: true,          /* 바로 다음 인자로 오는 콜백함수의 인자에 req 를 추가할지 여부 true: 추가 / false: 미추가(default) */
> }, (req, userId, userPassword, done) => {
>     process.nextTick(() => {
>         User.findById(userId, (err, user) => {
>             if (err) return done(err);
>             if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
>             if (!user.validPassword(userPassword))
>                 return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
>             else
>                 return done(null, user);
>         });
>     });
> }));
> 
> /* 회원가입(signup)에 사용할 LocalStrategy 정의 */
> passport.use('local-signup', new LocalStrategy({
>        usernameField: 'userId',
>        passwordField: 'userPassword',
>        passReqToCallback: true,
> }, (req, userId, userPassword, done) => {
>     process.nextTick(() => {
>         if (!req.user) {
>             User.findById(userId, (err, user) => {
>                 if (err) return done(err, null);
>                 if (user) {
>                     return done(null, false, req.flash('signupMessage', 'Wohh! the ID is already taken.'));
>                 } else {
>                     let newUser = new User.User(
>                         userId,
>                         bcrypt.hashSync(userPassword, bcrypt.genSaltSync(8), null),
>                         req.body.userName,
>                         req.body.userPhone,
>                         req.body.userEmail,
>                     );
>                     User.save(newUser, (err) => {
>                         if (err) throw err;
>                         return done(null, newUser);
>                     });
>                 }
>             });
>         }
>     });
> }));
> ```
> 사용: server/routes/user.js
> ```javascript
> /* '/login' 라우트에 위에서 정의한 로그인용 LocalStrategy 사용 */
> router.post('/login', passport.authenticate('local-login', {
>     successRedirect: '/user/profile',
>     failureRedirect: '/user/login',
>     failureFlash: true     /* true: LocalStrategy 에서 실패시 지정한 메시지를 Flash 등록, true가 아닌 문자열로 직접 값 대입 가능 */
> }));
> 
> /* '/signup' 라우트에 위에서 정의한 회원가입용 LocalStrategy 사용 */
> router.post('/signup', passport.authenticate('local-signup', {
>     successRedirect: '/user/profile',
>     failureRedirect: '/user/signup',
>     failureFlash: true     /* true: LocalStrategy 에서 실패시 지정한 메시지를 Flash 등록, true가 아닌 문자열로 직접 값 대입 가능 */
> }));
> ```

### body-parser
> POST로 요청된 body를 쉽게 추출할 수 있는 모듈  
> 설치: `npm i body-parser`     
> 사용
> ```javascript
> const express = require('express');
> const bodyParser = require('body-parser');
> const app = express();
> 
> app.use(bodyParser.json());
> app.use(bodyParser.urlencoded({extended: false}));
> ``` 
>
> POST JSON Body 로 요청이 온 경우 및 form data 로 요청이 온 경우 모두 다음과 같이 `req.body`를 사용한다.  
> ex) { userId: 'jujin', password: '1234' }
> ```javascript
> app.post('/', (req, res) => {
>       let userId = req.body.userId;
>       let password = req.body.password;
> });
> ```
> 혹은
> ```javascript
> app.post('/', (req, res) => {
>       let { userId, password } = req.body;
> });
> ```
>
> <b>URL encoding 이란?</b>   
> URL에 사용되는 문자열을 encoding 하는 것, 알파벳의 경우 인코딩이 되어도 알파벳 그대로지만 공백이나 한글 및 특수문자의 경우
% 로 시작하는 문자로 인코딩하여 통신에 사용한다. 그래서 bodyParser.urlencoded 를 사용하여 URL 문자열을 받아 디코딩하여 사용하도록 옵션을 지정한다.   
> <b>ex)</b> 안녕 을 URL encoding 하면 -> %ec%95%88%eb%85%95   
[온라인 URL 인코더](https://www.convertstring.com/ko/EncodeDecode/UrlEncode) 페이지에서 확인할 수 있다.
>
> extended 옵션: `qs` 모듈 사용 여부이며 `querystring` 모듈 보다 조금 더 확장된 기능을 제공한다.   
> express 4.16.0 버전 부터 body-parser 의 일부 기능이 익스프레스에 내장되어서 req body 가 JSON 포멧 혹은 url encoded 포멧인 경우 다음과 같이 사용한다.
> ```javascript
> const express = require('express');
> const app = express();
> 
> app.use(express.json());
> app.use(express.urlencoded({extended: false}));
> ```
>
> 하지만 body 가 버퍼 데이터 혹은 텍스트 데이터인 경우 body-parser를 이용한다.
> ``` javascript
> // raw: 버퍼 데이터인 경우
> app.use(bodyParser.raw());
> // text: 텍스트 데이터인 경우
> app.use(bodyParser.text());
> ```
> body-parser 를 통해 파싱된 request의 body는 req.body 를 통해서 사용할 수 있다.  
> 출처1: [body-parser 모듈 (urlencoded, extended 옵션)](https://sjh836.tistory.com/154)  
> 출처2: [Node - Express 미들웨어 body-parser](https://backback.tistory.com/336)  


