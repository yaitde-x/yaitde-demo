
import 'jest-extended';
import { FileEntry, IFileApi } from '../core/file-api/file-interfaces';
import { VersionEntry, VersionManager, VersionState_Approved, VersionState_Gauntlet, VersionState_New, VersionState_Released } from '../router/version/version-manager';

const sampleEntry : VersionEntry = {
    internal : "yaitde-app-106",
    release : "v2",
    pod : {
        "ui": "yaitde-ui-97",
        "api" : "yaitde-agent-103",
        "mock" : "yaitde-agent-103",
        "repo" : "V2"
    },
    state: VersionState_Gauntlet
}

const versionSeed : VersionEntry[] = [
    {
        internal: "yaitde-app-1",
        release: "v1",
        pod : {
            "ui": "yaitde-ui-master-49",
            "api" : "yaitde-agent-master-97",
            "mock" : "yaitde-agent-master-97",
            "repo" : "V1.3"
        },
        state: VersionState_Released
    },
    {
        internal: "yaitde-app-2-3",
        release: "v4.5",
        pod : {
            "ui": "yaitde-ui-master-50",
            "api" : "yaitde-agent-master-97",
            "mock" : "yaitde-agent-master-97",
            "repo" : "V1.3"
        },
        state: VersionState_Approved
    },
    {
        internal: "yaitde-app-3",
        release: null,
        pod : {
            "ui": "yaitde-ui-master-50",
            "api" : "yaitde-agent-master-98",
            "mock" : "yaitde-agent-master-98",
            "repo" : "V1.3"
        },
        state: VersionState_New
    }
];

test('create a new version record for a functional component', () => {

    const mockFileApi = new MockFileApi(versionSeed, true);
    const versionManager = new VersionManager(mockFileApi, "base-path");

    const versionRecord = versionManager.createVersionForNewFunctionalUnit("ui", "master", "50");
});



class MockFileApi implements IFileApi {

    private _data: VersionEntry[];
    private _fileExists: boolean;

    constructor(data: VersionEntry[], fileExist: boolean) {
        this._data = data;
        this._fileExists = fileExist;
    }
    
    pathExists(path: string): boolean {
        throw new Error('Method not implemented.');
    }
    copyFile(sourcePath: string, targetPath: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    listFiles(path: string, pattern: string, recurse?: boolean, callback?: (entry: FileEntry) => void): Promise<FileEntry[]> {
        throw new Error('Method not implemented.');
    }

    readFile(fullPath: string): Promise<Buffer> {
        throw new Error('Method not implemented.');
    }

    writeFile(fullPath: string, contents: Buffer): Promise<void> {
        throw new Error('Method not implemented.');
    }

    deleteFile(fullPath: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    renameFile(oldPath: string, newPath: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    readFileLines(fullPath: string, lineProcessor: (ln: string, last: any) => boolean): void {
        throw new Error('Method not implemented.');
    }

    readJsonFileAs<T>(basePath: string, pathPart: string = ""): T {
        return <T>(this._data as any);
    }

    ensurePathExists(path: string): void {
        throw new Error('Method not implemented.');
    }

    fileExists(path: string): boolean {
        return true;
    }

    removeDirectory(path: string): void {
        throw new Error('Method not implemented.');
    }

}