
# Orchestrator Overview 
```json
[
    {
        feed: "technical",
        collection: "someguid",
        document: "someguid2",
        section: 1
    }
]
```

## Summary

The Orchestrator is built to live in a container that uses `dind` to access and run `docker` and `docker-compose`. The `yaitde-router` is running this way and runs commands using the `ShellRunner` class.

## Requirements

- Any container running the Orchestrator must have `dind` enabled. Documentation for this is in the ops repo.

## Config

Accesses files located in Yaitde system root. The root is mapped when the container running the Orchestrator is started. In a container, the Yaitde system root is here `/usr/src/yaitde`. It's not an env var, but I'll use `$YAITDE_ROOT` in the rest of this doc. 

The Orchestrator uses $YAITDE_ROOT to build its own root: $ORCH_ROOT = $YAITDE_ROOT/automation/compose.
There are a few files in $ORCH_ROOT that the Orchstrator expects:

- $ORCH_ROOT/docker-cmp-agent.yaml : this is the template (see below) used to compose a new app container.
- $ORCH_ROOT/dockerPat.txt : this contains the PAT for ghcr.io so the Orchstrator can pull new images
- $ORCH_ROOT/login.sh : this is a login script used to login to ghcr.io

Samples of all these file can be found in the ops repo.

## Capabilities

### IsApplicationRunning

Given and appId, can query docker to see if a container is already running

### ApplicationUp

First checks to see if the app is already running. If it is not, then it makes a copy of `$ORCH_ROOT/docker-cmp-agent.yaml` to `$ORCH_ROOT/runtime/$APP_ID.yml`. In the process, it replaces the tags `yaitde-agent-svc-name` and `yaitde-agent-net` with variants based upon $APP_ID.

It runs `docker-compose -f ./runtime/$FILE_NAME up -d` on the generated file to bring the container up. Part of that compose, creates a named network  `$APP_ID-net`. For example: `yaitde-mock-master-77-net`.

It then runs a docker command to add the `yaitde-router` to the newly created network. 

### ApplicationDown

First checks to see if the app is running. Then removes the `yaitde-router` from the apps network and then runs `docker-compose -f ./runtime/$FILE_NAME down` to take the container offline and delete it.

It does not delete the source image or delete the apps compose file from $ORCH_ROOT/runtime.
