FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY ./config.json ./

COPY server server
RUN cd server && npm install

COPY smart-contracts smart-contracts
RUN cd ./smart-contracts && npm install && npm start

# COPY server server
# RUN cd ./server && npm run deploy

COPY client client
RUN cd client && npm install && npm run build

WORKDIR /usr/src/app/server

EXPOSE 3000
CMD [ "npm", "start" ]

