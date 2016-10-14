FROM mhart/alpine-node:6.7.0

WORKDIR /app

RUN apk add --no-cache python

EXPOSE 8080
