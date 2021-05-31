FROM node:14-alpine3.13

MAINTAINER Ronan Harris

WORKDIR /var/www/es-discord-oreonitemanganese

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]