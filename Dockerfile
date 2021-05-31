FROM node:14-alpine3.13

MAINTAINER Ronan Harris

WORKDIR /usr/es-discord-oreonitemanganese

COPY package.json ./

RUN npm install

COPY . .