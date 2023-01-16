FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install --force

# Bundle app source
COPY . /usr/src/app

RUN npm run build

CMD npm start

