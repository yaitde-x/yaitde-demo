
# Overseer Overview 
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

The Overseer maintains a catalog of available applications. It backs the following endpoints

## Requirements

## Config

Reads and writes `apps.json` located in Yaitde system root. The root is mapped when the container running the Orchestrator is started. In a container, the Yaitde system root is here `/usr/src/yaitde`. It's not an env var, but I'll use `$YAITDE_ROOT` in the rest of this doc. 

## Model
```typescript
export interface ApplicationInstance {
    applicationId: string;
    branchId: string;
    buildId: string;
    imagePath?: string;
}
```

## Capabilities

We have a Github custom hook that runs as part of the workflow that is triggered when a new PR is pushed to `master` or `feature-*`. Our listener on the other end, grabs the relevant data, builds a new `ApplicationInstance` and writes it to the Overseer. The Overseer takes care of maintaining an in memory list of apps as well as mirroring that list to disk. The the `yaitde-router` starts, the Overseer loads its list back into ram.

In this way, the list of available apps grows everytime a new image is pushed to the container registry. The GET api below returns this list.


## API

### GET /api/ops/ls

return the list of known apps

### DEL api/ops/rm

pass an app, it will remove it and its image from the local docker instance


