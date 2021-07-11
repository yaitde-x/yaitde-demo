#!/bin/sh
/usr/local/bin/docker container ls -a --format "{{json .}}" | jq "{ID, Names, Image, Labels, CreatedAt, Ports, Mounts, RunningFor, Status}" | jq -s
