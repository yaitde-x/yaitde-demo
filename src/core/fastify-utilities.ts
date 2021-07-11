import queryString from "querystring";
import { ContentType_ApplicationJson } from "./const";
import { InvalidObjectId, ObjectNotFound } from "./errors/errors";

//  linda.getoffmylawn.xyz
export const extractHostnameOnly = (hostNameAndMaybePort: string): string => {
    if (!hostNameAndMaybePort || hostNameAndMaybePort.indexOf(":") === -1)
        return hostNameAndMaybePort;

    return hostNameAndMaybePort.substr(0, hostNameAndMaybePort.indexOf(":"));
};

export const extractQueryParameter = (key: string, path: string): string => {
    if (path && path.indexOf('?') > -1)
        path = path.substr(path.indexOf('?') + 1);

    const queryParams = queryString.parse(path);
    if (queryParams && queryParams[key])
        return <string>queryParams[key];
};

export const generateErrorResponse = (error, reply): void => {
    if (error instanceof ObjectNotFound)
        reply.code(404).send(error.message);
    else if (error instanceof InvalidObjectId)
        reply.code(400).send(error.message);
    else
        reply
            .code(500)
            .type(ContentType_ApplicationJson)
            .send(error);
};