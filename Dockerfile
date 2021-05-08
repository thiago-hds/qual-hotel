# syntax=docker/dockerfile:1

FROM node:15
ENV NODE_ENV=development

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
CMD [ "node", "server.js" ]


