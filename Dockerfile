###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-slim As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-slim As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM ubuntu:focal

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests tini \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

ENTRYPOINT ["/usr/bin/tini", "--"]

COPY --from=build --chown=root:root /usr/local/include/ /usr/local/include/
COPY --from=build --chown=root:root /usr/local/lib/ /usr/local/lib/
COPY --from=build --chown=root:root /usr/local/bin/ /usr/local/bin/

USER node

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node . .

CMD [ "npm", "start" ]
