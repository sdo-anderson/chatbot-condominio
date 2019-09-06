FROM node:10-alpine

WORKDIR /usr/app
COPY . .

RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]