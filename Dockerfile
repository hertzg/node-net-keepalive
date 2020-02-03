FROM node:alpine

RUN apk add --no-cache bash alpine-sdk python tcpdump

WORKDIR /app
VOLUME /app

COPY . .

ENTRYPOINT "/bin/bash"
