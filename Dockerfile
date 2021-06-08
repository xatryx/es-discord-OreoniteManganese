FROM node:14-alpine3.13

LABEL maintainer="Ronan Harris,M. Hanif Azhary"
LABEL version="3.2"

# Create and change to the app directory.
WORKDIR /usr/es-discord-oreonitemanganese

# Copy application dependency manifests to the container image.
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