# postgres:12
FROM postgres:14.1-alpine

RUN apt-get clean && apt-get update && \
    apt-get install -y postgresql-contrib

ADD *.sql /docker-entrypoint-initdb.d/