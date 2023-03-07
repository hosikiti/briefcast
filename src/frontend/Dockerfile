FROM node:lts-alpine3.16
EXPOSE 9696

WORKDIR /app

COPY . .

RUN npm install

RUN apk add git