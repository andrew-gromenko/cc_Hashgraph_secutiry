# FROM node:9.4.0

# # Create app directory
# WORKDIR /usr/src/app

# COPY ./config.json ./

# COPY server/package*.json server/
# RUN cd server && npm install

# COPY smart-contracts/package*.json smart-contracts/
# RUN cd smart-contracts && npm install

# COPY client/package*.json client/
# RUN cd client && npm install

# COPY smart-contracts smart-contracts/a
# RUN mv smart-contracts/a/* smart-contracts/

# RUN cd smart-contracts && npm start

# COPY client client/a
# RUN mv client/a/* client/
# RUN cd client && npm run build

# COPY server server/a
# RUN mv server/a/* server/

# WORKDIR /usr/src/app/server

# EXPOSE 3000
# CMD [ "npm", "start" ]

FROM node:9.4.0

# Create app directory
WORKDIR /usr/src/app

COPY ./config.json ./

COPY server/package*.json server/
RUN cd server && npm install

COPY smart-contracts/package*.json smart-contracts/
RUN cd smart-contracts && npm install

COPY client client
RUN cd client && npm install 
RUN cd client && npm run build

COPY smart-contracts smart-contracts/a
RUN mv smart-contracts/a/* smart-contracts/

RUN cd smart-contracts && npm start

COPY server server/a
RUN mv server/a/* server/
WORKDIR /usr/src/app/server

EXPOSE 3000
CMD [ "npm", "start" ]
