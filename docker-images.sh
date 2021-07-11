#!/bin/sh
/usr/local/bin/docker image ls -a --format "{{json .}}" | jq "{Containers, CreatedSince, Digest, ID, Repository, SharedSize, Size, Tag, UniqueSize, VirtualSize}" | jq -s
