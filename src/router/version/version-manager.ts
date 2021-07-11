import path from "path";
import { IFileApi } from "../../core/file-api/file-interfaces";
import { parseApplicationIdentifier, yaitdeVersionCompare } from "../../core/utility";
import { KeyedCollection } from "../../core/utility/dictionary";

export const VersionState_New = "new";
export const VersionState_Gauntlet = "gauntlet";
export const VersionState_Failed = "failed";
export const VersionState_ManualApprovalQueue = "woa";
export const VersionState_Approved = "approved";
export const VersionState_Released = "released";
export const VersionState_Bad = "bad";

const  makeIndexKey = (functionalIdentifier: string, branch: string) : string => {
    return functionalIdentifier + "-" + branch;
}

export interface Pod {
    "ui": string,
    "api": string,
    "mock": string,
    "repo": string
}

export interface VersionEntry {
    internal: string;
    release: string;

    pod: Pod,
    state: string;
}

const sampleEntry: VersionEntry = {
    internal: "yaitde-app-106",
    release: "v2",
    pod: {
        "ui": "yaitde-ui-97",
        "api": "yaitde-agent-103",
        "mock": "yaitde-agent-103",
        "repo": "V2"
    },
    state: VersionState_Gauntlet
}

/***
 * Business Rules:
 * - a group of related containers is a pod or collectively, the app
 * - a dependency chain object for the app defines the relationship and versions for all containers
 * - when a new version of any container in a pod gets published, a new yaitde-app-{{version number}} is created
 * - a version record fully describes the app and might be the master record for the app.
 * - the dependency chain object is used to look up and down the chain when member containers are published
 * - the version manager tries to find related apps in the same branch
 * - if no appid + branch container is found for a related app, then select master
 * - to start, we will support only a single app/dependency chain. later we can enable other bundles.
 */
export class VersionManager {

    private _fileApi: IFileApi;
    private _basePath: string;
    private _versionList: VersionEntry[];
    private _versionIndex: KeyedCollection<VersionEntry>;
    private _functionalUnitIndex : ApplicationIndex;
    private _dependencyChain = {
        "appId": "ui",
        "dependsOn": [
            {
                "appId": "api",
                "dependsOn": [
                    "repo"
                ]
            },
            {
                "appId": "mock",
                "dependsOn": [

                ]
            }
        ]
    };

    constructor(fileApi: IFileApi, basePath: string) {
        this._fileApi = fileApi;
        this._basePath = basePath;
        this._versionList = [];
        this._versionIndex = new KeyedCollection<VersionEntry>();

        this.loadVersions();
        this._functionalUnitIndex = new ApplicationIndex(this._versionList);
    }

    private getPath(): string {
        return path.join(this._basePath, "versions.json");
    }

    private loadVersions() {
        const filePath = this.getPath();

        if (this._fileApi.fileExists(filePath)) {
            this._versionList = this._fileApi.readJsonFileAs<VersionEntry[]>(filePath);

            if (this._versionList.length > 0) {
                for (const version of this._versionList) {
                    this._versionIndex.add(version.internal, version);
                }
            }
        }
    }

    public createVersionForNewFunctionalUnit(functionalIdentifier: string, branch: string, buildNumber: string): VersionEntry {

        const indexKey = makeIndexKey(functionalIdentifier, branch);
        const appEntry = this._functionalUnitIndex.getLatestVersionForFunctionalUnit(functionalIdentifier, branch);
        
        for (const existingVersion of this._versionList)
            return undefined;
    }
}

interface ApplicationVersionEntry {
    applicationId: string;
    versionNumber: string;
    latestVersion: VersionEntry;
    allVersions: VersionEntry[];
}

export class ApplicationIndex {

    private _index: KeyedCollection<ApplicationVersionEntry>;

    constructor(seedVersions: VersionEntry[]) {
        this._index = this.initialIndex(seedVersions);
    }

    initialIndex(seedVersions: VersionEntry[]): KeyedCollection<ApplicationVersionEntry> {
        const index = new KeyedCollection<ApplicationVersionEntry>();

        for (const versionEntry of seedVersions) {
            this.internalRegisterVersion(index, versionEntry);
        }

        return index;
    }

    internalRegisterVersion(index: KeyedCollection<ApplicationVersionEntry>, versionEntry: VersionEntry): void {

        const appIdentifier = parseApplicationIdentifier(versionEntry.internal);
        const applicationId = makeIndexKey(appIdentifier.functionalIdentifier, appIdentifier.branch);

        if (index.containsKey(applicationId)) {
            const entry = index.item(applicationId);

            const compareResult = yaitdeVersionCompare(entry.versionNumber, appIdentifier.buildId);
            if (compareResult !== 0)
                entry.allVersions.push(versionEntry);

            if (compareResult === -1) { // latest version is not latest
                entry.versionNumber = appIdentifier.buildId;
                entry.latestVersion = versionEntry;
            }
        } else {
            const entry: ApplicationVersionEntry = {
                applicationId: applicationId,
                versionNumber: appIdentifier.buildId,
                latestVersion: versionEntry,
                allVersions: [versionEntry]
            };

            index.add(applicationId, entry)
        }
    }

    public registerVersionForFunctionalUnit(versionEntry: VersionEntry): void {
        this.internalRegisterVersion(this._index, versionEntry);
    }

    public getLatestVersionForFunctionalUnit(functionalIdentifier: string, branch: string): VersionEntry {
        const record = this._index.item(makeIndexKey(functionalIdentifier, branch));
        return record ? record.latestVersion : undefined;
    }
}