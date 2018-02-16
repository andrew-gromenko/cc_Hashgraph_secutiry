FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN cd server && npm install
# If you are building your code for production
# RUN npm install --only=production

WORKDIR /usr/src/app/server

EXPOSE 3000
CMD [ "npm", "start" ]
