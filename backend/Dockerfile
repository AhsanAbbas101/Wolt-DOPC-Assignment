# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE ${PORT}

FROM base AS dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

FROM base AS dev
ENV NODE_ENV=development
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]



FROM base AS test
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run test
CMD ["npm", "run", "test"]

FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run tsc


FROM base AS prod
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm ci --omit=dev

USER node
CMD ["node", "dist/index.js"]
