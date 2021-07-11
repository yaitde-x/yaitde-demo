import { RuntimeContext } from "../env/env-interfaces";

export interface ModelIdentity {
    id: string;
}

export interface TestHeader {
    key: string;
    value: string;
    disabled?: boolean;
    type: string;
    name?: string;
}

export interface YaitdeRequestBody {
    type: string;
    raw?: string;
}

export interface YaitdeRequest {
    url: string;
    method: string;
    headers: TestHeader[];
    body: any;
}

export interface YaitdeTest extends ModelIdentity {
    id: string;
    pmid?: string;
    description: string;
    request: YaitdeRequest;
    scripts: YaitdeScript[];
}

/**
 * 
 * SUMMARY:
 *  represents an executable block. Later we can define other 'types' such that 
 *  it could be a remote api call, a dotnet script, etc. For now, data will contain the executable 
 *  script.
 *  
 * @constructor
 * @param {string} id - not sure we need this. could be collectionid + testid + script name
 * @param {string} on - when the script will run. for instance, pre and post
 * @param {string} type - javascript/typescript etc.
 * @param {string} data - the script.
 * 
 */
export interface YaitdeScript extends ModelIdentity {
    id: string;
    pmid?: string;
    on: string;
    type: string;
    disabled?: boolean;
    description?: string;
    data: string;
}

export interface YaitdeNode {
    name: string;
    nodes: YaitdeNode[];
    item?: YaitdeTest;
}

export interface YaitdeCollectionItem {
    type: string;
    resourceName: string;
    resourceId?: string;
    children?: YaitdeCollectionItem[];
    data?: any;
}

export interface YaitdeCollection extends ModelIdentity {
    id: string;
    pmid?: string;
    description?: string;
    schema: string;
    tree: YaitdeCollectionItem;
}

export interface YaitdeTestBundle {
    collection: YaitdeCollection;
    tests: YaitdeTest[];
}

export interface YaitdeCollectionRun {
    testBundle: YaitdeTestBundle;
    context: RuntimeContext;
}
