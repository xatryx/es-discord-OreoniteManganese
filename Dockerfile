FROM node:12-alpine

LABEL maintainer="Ronan Harris,M. Hanif Azhary"
LABEL version="3.2"

# Create and change to the app directory.
WORKDIR /usr/es-discord-oreonitemanganese

# Copy require files to the container image.
COPY credentials.json ./
COPY package.json ./

# Install node dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose port
ARG PORT=8080
EXPOSE $PORT

# Run the web service on container startup.
CMD [ "npm", "start" ]