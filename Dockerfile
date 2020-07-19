FROM node:14-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json .
RUN npm ci

COPY lib/ lib/
COPY index.js .

RUN chown -R node:node /app
USER node

CMD ["node","index.js"]
