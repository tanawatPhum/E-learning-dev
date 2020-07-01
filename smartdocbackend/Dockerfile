FROM node:alpine AS builder

WORKDIR smartdocbackend

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "smartdocbackend.js" ]