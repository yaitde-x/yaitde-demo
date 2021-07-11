# Yaitde Agent

The agent will run in 4 modes:
- Router
    - this is the guy that sits behind nginx and makes sure the requested container is running. It then forwards the request on to the selected container. 
- Mock
    - The mock server is used to run the Feature Suite tests against
- Api
    - The main Yaitde Api
- Console
    - Development console. companion app to the api

to build the base image
```
docker build -f ./dockerfile-npm-dckr -t yaitdex/yaitde-base-img .
```

then tag it with the github container tag
```
docker tag yaitdex/yaitde-base-img  ghcr.io/yaitde/yaitde-agent-base
```

then push it to the ghcr
```
docker push  ghcr.io/yaitde/yaitde-agent-base
```

## There are NPM scripts to run the agent in the various modes
```
npm run router
npm run mock
npm run api 
npm run console
```

or just build or Docker build. The same Docker image is used for all modes
```
npm run compile
npm run dckr-bld
```

to run the docker image in the various modes
```
npm run dckr-mock
npm run dckr-router
npm run dckr-console
npm run dckr-api
```

to clean the containers
```
npm run dckr-clean-all
npm run dckr-clean-mock
npm run dckr-clean-router
npm run dckr-clean-console
npm run dckr-clean-api
```

## Utilitiy and scratch

load a file into an env_var
```
var=$(cat filename)
```

To build the container
```
DOCKER_BUILDKIT=1 docker build -f ./dockerfile-npm  --secret id=NPM_TOKEN,src=npm-token.txt -t yaitdex/yaitde-agent .
```

To tag an image with a new tag:
```bash
docker image tag yaitdex/yaitde-agent yaitdex/yaitde-agent:master-67 
```

To remove a container so you can redeploy with specific name and port
```
docker stop yaitde-agent && docker rm yaitde-agent
```

if you run like this your terminal will block and you can see the log output
```
docker run -ti -p 3000:3000 -v ~/code/yaitde-test-repo:/usr/src/app/yaitde-repo -v ~/.yaitde:/usr/src/yaitde --name=yaitde-agent --restart=always -e SIGNING_KEY='devsDontNeedNoStinkinKey' yaitdex/yaitde-agent
```
or run with the -d to launch it detached
```
docker run -d -p 3000:3000 -v ~/code/yaitde-test-repo:/usr/src/app/yaitde-repo -v ~/.yaitde:/usr/src/yaitde --name=yaitde-agent --restart=always -e SIGNING_KEY='devsDontNeedNoStinkinKey' yaitdex/yaitde-agent
```

then later you may need to attach to the shell
```
docker exec -i -t yaitde-agent /bin/bash
```

other useful commands
```
docker images
docker container ls
```

other things I worked with
```
docker build -t yaitdex/yaitde-agent .
DOCKER_BUILDKIT=1 docker build --secret id=NPM_KEY,src=.npmrc -t yaitdex/yaitde-agent .
DOCKER_BUILDKIT=1 docker build --secret id=NPM,src="/Users/sakamoto/.npmrc" -t yaitdex/yaitde-agent .
NPM_TOKEN=$(cat npm-token.txt) docker build -f ./dockerfile-npm --build-arg NPM_TOKEN=$NPM_TOKEN -t yaitdex/yaitde-agent .

```