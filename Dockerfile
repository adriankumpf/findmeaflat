FROM node:8.9.4-alpine
LABEL maintainer="adrian.kumpf@posteo.de"

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY lib/ lib/
COPY index.js .

RUN chown -R node:node /app
USER node

CMD ["node","index.js"]
