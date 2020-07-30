FROM node:14-alpine

ENV NODE_ENV=production

USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --progress=false --no-audit --loglevel=error

COPY --chown=node:node lib/ lib/
COPY --chown=node:node index.js ./
RUN mkdir db conf

CMD ["node","index.js"]
