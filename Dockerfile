FROM node:11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "./src/server.js" ]