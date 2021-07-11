
# vars
```bash
APP_NAME="yaitde-agent-mock"
```

# list images matching a pattern
```
docker image  ls --format "{{json .}}" yaitdex/*
```


# create a network
```bash
docker network create -d bridge yaitde-agent-mock:master-64-net --format "{{json .}}"
# returns: 06149f3e267c5df8ee23d2763e32e036feae860e7d6e53ca8a5c081fc431bed5
```

# delete a network
```bash
docker network rm yaitde-agent-mock:master-64-net --format "{{json .}}"
# returns: yaitde-agent-mock:master-64-net
```

# Example of 1 container per instance
```bash

EXTERNAL_ASSIGNED_PORT=3000
INSTANCE_ID=1
SIGNING_KEY=')H@McQfTjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+MbQeThWmZq4t7w!z%C*F)J@NcRfUjXn2r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B&E)H@McQfThWmZq4t7w!z%C*F-JaNdRgUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z$C&'
APP_ID='master-63'

docker run -d -p $EXTERNAL_ASSIGNED_PORT:3000 -v /home/yaitdex/$INSTANCE_ID/repo:/usr/src/app/yaitde-repo -v /home/yaitdex/.yaitde/$INSTANCE_ID:/usr/src/yaitde --name=yaitde-agent-$APP_ID-$INSTANCE_ID --restart=always --network="yaitde-net-$APP_ID-$INSTANCE_ID" -e SIGNING_KEY=$SIGNING_KEY ghcr.io/yaitde/yaitde-agent:$APP_ID 
```

# connect a running container to a network
```
docker network connect --alias yaitde-mock  yaitde-agent-mock:master-64-net yaitde-agent-mock:master-64
```

```
docker run -p 3000:3000 -v ~/code/yaitde-test-repo:/usr/src/app/yaitde-repo -v ~/.yaitde:/usr/src/yaitde --name=yaitde-router: --restart=always --network="yaitde-net" -e SIGNING_KEY=')H@McQfTjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+MbQeThWmZq4t7w!z%C*F)J@NcRfUjXn2r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B&E)H@McQfThWmZq4t7w!z%C*F-JaNdRgUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z$C&' yaitdex/yaitde-agent
```


# steps to dispatch
0. login
```bash
$USER_NAME='yaitde-automation'
docker login -user $USER_NAME -pwd stdin
```

1. check to see if the image is local
```bash
APP_ID='master-63'
docker images "ghcr.io/yaitde/yaitde-agent:$APP_ID" --format "{{json .}}"
```
    - no: DL the image
```bash
APP_ID='master-63'
docker pull 'ghcr.io/yaitde/yaitde-agent:$APP_ID'
```
2. check to see if the container is running
    # list any containers matching the name
```bash
APP_ID='master-63'
AGENT_TYPE='mock'
docker ps -f "name=yaitde-$AGENT_TYPE-$APP_ID" --format "{{json .}}"
```
    - no: 
    - create a network
```bash
APP_ID='master-63'
AGENT_TYPE='mock'

docker network create -d bridge yaitde-$AGENT_TYPE-$APP_ID-net --format "{{json .}}"
# returns: 06149f3e267c5df8ee23d2763e32e036feae860e7d6e53ca8a5c081fc431bed5
```  
    - start the container, on the new network
```bash
EXTERNAL_ASSIGNED_PORT=asDeterminedByOrchestrator
APP_ID='master-63'
RUN_MODE='-m'
AGENT_TYPE='mock'
docker run -d -p $EXTERNAL_ASSIGNED_PORT:3000 -v /home/yaitdex/repos:/usr/src/app/yaitde-repos -v /home/yaitdex/.yaitde:/usr/src/yaitde --name=yaitde-$AGENT_TYPE-$APP_ID --restart=always --network="yaitde-$AGENT_TYPE-$APP_ID-net" ghcr.io/yaitde/yaitde-agent:$APP_ID 
```

    - join the yaitde-router to this network
```bash
#todo
```

3. forward the request



# running this locally
mock1 network
```
docker network create -d bridge yaitde-mock-master-63-net
```

run mock 1
```
docker run -d -ti -p 3101:3000 -v ~/yaitde-mock-repos/mock1:/usr/src/app/yaitde-repo -v ~/.yaitde:/usr/src/yaitde --name=yaitde-mock-master-63 --restart=always -e SIGNING_KEY='devsDontNeedNoStinkinKey' -e RUN_MODE='-m' --network="yaitde-mock-master-63-net" yaitdex/yaitde-agent 
```
mock2 network
```
docker network create -d bridge yaitde-mock-master-64-net
```

run mock2
```
docker run -d -ti -p 3102:3000 -v ~/yaitde-mock-repos/mock2:/usr/src/app/yaitde-repo -v ~/.yaitde:/usr/src/yaitde --name=yaitde-mock-master-64 --restart=always -e SIGNING_KEY='devsDontNeedNoStinkinKey' -e RUN_MODE='-m' --network="yaitde-mock-master-64-net" yaitdex/yaitde-agent 
```

run the router
```
docker run -d -ti -p 3001:3000 -v ~/.yaitde:/usr/src/yaitde --name=yaitde-router --restart=always -e SIGNING_KEY='devsDontNeedNoStinkinKey' -e RUN_MODE='-r' yaitdex/yaitde-agent 
```

add the new networks to yaitde-router
```
docker network connect yaitde-mock-master-63-net yaitde-router
docker network connect yaitde-mock-master-64-net yaitde-router
```
