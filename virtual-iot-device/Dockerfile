FROM node:12-alpine

WORKDIR /usr/app

# ENV AWS_ACCESS_KEY_ID
# ENV AWS_SECRET_ACCESS_KEY
# ENV AWS_DEFAULT_REGION

ADD package.json .

RUN npm install

ADD . .

RUN npm run compile

CMD ["node", "build/src/index.js"]