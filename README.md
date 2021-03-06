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
