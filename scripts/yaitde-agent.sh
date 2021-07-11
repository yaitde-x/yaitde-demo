$USER_NAME='yaitdex'
APP_ID='master-64'
AGENT_TYPE='mock'
APP_ID='master-64'
RUN_MODE='-m'

# login with a PAT fed from a file into this script
# like so $(cat pat.txt) > ./thisscript.sh
docker login -user $USER_NAME -pwd stdin

docker network create -d bridge yaitde-$AGENT_TYPE-$APP_ID-net --format "{{json .}}" > $AGENT_TYPE-$APP_ID.txt

docker run -d -p $EXTERNAL_ASSIGNED_PORT:3000 -v /home/yaitdex/repos:/usr/src/app/yaitde-repos -v /home/yaitdex/.yaitde:/usr/src/yaitde --name=yaitde-$AGENT_TYPE-$APP_ID --restart=always --network="yaitde-$AGENT_TYPE-$APP_ID-net" ghcr.io/yaitde/yaitde-agent:$APP_ID 

docker network connect yaitde-mock-master-63-net yaitde-router
