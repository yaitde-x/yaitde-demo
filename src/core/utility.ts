import fs from 'fs';
import path from 'path';

export interface ApplicationIdentifier {
    functionalIdentifier: string;
    branch: string;
    buildId: string;
    tag: string;
}

export const readJsonFile = (basePath: string, pathPart: string): any => {
    const data = fs.readFileSync(path.join(basePath, pathPart));
    return JSON.parse(data.toString());
};

export const yaitdeVersionCompare = (version1: string, version2: string) : number  => {
    if (!version1 && !version2)
        return 0;
    if (!version1)
        return -1;
    if (!version2)
        return 1;

    return version1 === version2 ? 0 : version1 < version2 ? -1 : 1;
}

/*
    Application Identifier Anatomy
    example: yaitde-api-feature-ui-api-103

    yaitde: namespace (always yaitde)
    api: application component
    feature-ui-api: branch
    103: build serial number (unique to a repo)
    tag: feature-ui-api-103
*/

export const parseApplicationIdentifier = (appId: string): ApplicationIdentifier => {
    const parts = appId.split("-");

    return { 
        functionalIdentifier: parts[1], 
        branch: parts.slice(2, parts.length - 1).join("-"), 
        buildId: parts[parts.length-1], 
        tag: parts.slice(2, parts.length).join("-") };
};

export const processApplicationId = (appId: string): [agent: string, tag: string] => {
    const parts = appId.split("-");
    const agentType = parts[1];
    const tagName = parts.slice(2, parts.length).join("-");
    return [agentType, tagName];
};

export function toType<T>(model: any): T {
    return <T>model;
}