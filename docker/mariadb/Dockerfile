FROM mariadb:10.5.9
LABEL maintainer="jujin1324@daum.net"
LABEL dockerhub="https://hub.docker.com/_/mariadb?tab=description&page=1&ordering=last_updated"

# Docker Ubuntu Container 한글 패치: https://seolin.tistory.com/81
RUN apt-get update; apt-get install -y locales
RUN locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
RUN update-locale LANG=ko_KR.UTF-8

ADD init1.sql /docker-entrypoint-initdb.d/
ADD init2.sql /docker-entrypoint-initdb.d/
