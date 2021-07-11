# syntax = docker/dockerfile:1.0-experimental
FROM node:14
LABEL Yaitde Agent <support@yaitde.com>
#ARG NPM_KEY

SHELL ["/bin/sh", "-c"],

RUN apt update
RUN apt install -y git

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY config-dkr.json ./config.json
COPY ./src ./src
COPY ./schemas ./schemas
#COPY .npmrc ./

#RUN echo $NPM_KEY
#RUN npm config set @yaitde:registry https://npm.getoffmylawn.xyz
#RUN npm config set _auth $NPM_KEY

#RUN echo $NPM_KEY > ./.npmrc

#RUN echo < $(npm config ls -l)
#RUN echo $(cat ./.npmrc)

#RUN echo $NPM_KEY > ./.npmrc && \
#RUN npm ci --quiet && npm run compile 

#RUN echo "npm signing key :"
RUN --mount=type=secret,id=NPM,dst=/usr/src/app/.npmrc npm ci --quiet && npm run compile
#RUN cat .npmrc

RUN npm ci --quiet && npm run compile

EXPOSE 3000

CMD [ "node", "build/main.js", $OPTION ]

