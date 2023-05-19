FROM node:20.1.0-slim

COPY app /app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#RUN npm install react-scripts --debug --legacy-peer-deps

RUN npm install

CMD ["node", "app.js"]