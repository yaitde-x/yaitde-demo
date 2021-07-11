
export interface FileEntry {
    name: string;
    fullPath: string;
    type: string;
    children?: FileEntry[]
}

export interface IFileApi {
    listFiles(path: string, pattern: string, recurse?: boolean, callback?: (entry: FileEntry) => void): Promise<FileEntry[]>;
    readFile(fullPath: string): Promise<Buffer>;
    writeFile(fullPath: string, contents: Buffer): Promise<void>;
    deleteFile(fullPath: string): Promise<void>;
    renameFile(oldPath: string, newPath: string): Promise<void>;
    readFileLines(fullPath: string, lineProcessor: (ln: string, last: any) => boolean): void
    readJsonFileAs<T>(basePath: string, pathPart?: string): T
    ensurePathExists(path: string): void;
    fileExists(path: string) : boolean;
    pathExists(path: string) : boolean;
    removeDirectory(path: string): void;
    copyFile(sourcePath: string, targetPath: string): Promise<void>;
}
