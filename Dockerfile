FROM node:alpine

ADD webapp /app
WORKDIR /app

RUN npm install
RUN npm run build

CMD npm run start