# syntax=docker/dockerfile:1

FROM node:15 as base
ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

# FROM base as test
# RUN yarn install --frozen-lockfile
# COPY . .
# RUN yarn test

FROM base as prod
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "node", "server.js" ]


