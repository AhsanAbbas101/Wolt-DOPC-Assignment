# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE 5173

FROM base AS dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

FROM base AS dev
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev","--","--host"]


FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN ["npm", "run", "build"]


FROM base AS prod
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm ci --omit=dev && npm install -g serve

USER node
CMD ["serve", "-s","-l", "5173","dist"]


