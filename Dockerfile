FROM node:carbon

# Create app directory
WORKDIR /usr/src/app/server

COPY server/package*.json ./
RUN npm i

WORKDIR /usr/src/app/client

COPY client/package*.json ./
RUN npm i

COPY client .
RUN npm run build

WORKDIR /usr/src/app

# Bundle app source
COPY . .

WORKDIR /usr/src/app/server

EXPOSE 3000
CMD [ "npm", "start" ]

