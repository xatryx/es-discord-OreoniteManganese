FROM node:14-alpine3.13

MAINTAINER Ronan Harris

WORKDIR /var/www/es-discord-oreonitemanganese

COPY package*.json /var/www/es-discord-oreonitemanganese

RUN npm install

COPY . /var/www/es-discord-oreonitemanganese

EXPOSE 8080