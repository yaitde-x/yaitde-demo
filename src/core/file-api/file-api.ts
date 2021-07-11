import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util'
import { IFileApi, FileEntry } from "./file-interfaces";
import { ILogger } from '../utility/logger';

import lineReader = require('line-reader');
import Promisex = require('bluebird');

export class LocalFileApi implements IFileApi {

    private _logger: ILogger;

    constructor(logger: ILogger, environment: any) {
        this._logger = logger;
    }

    public readJsonFileAs<T>(basePath: string, pathPart: string = ""): T {
        const data = fs.readFileSync(path.join(basePath, pathPart));
        return <T>JSON.parse(data.toString());
    }

    public ensurePathExists(path: string): void {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    public listFiles(rootPath: string, pattern: string, recurse?: boolean,
        callback?: (entry: FileEntry) => void): Promise<FileEntry[]> {

        const files: FileEntry[] = [];

        if (!recurse)
            recurse = false;

        try {

            const result = glob.sync(pattern, { cwd: rootPath, nodir: false });

            result.forEach((fileName) => {

                try {
                    const fullPath = path.join(rootPath, fileName);
                    const info = fs.statSync(fullPath);
                    const ftype = info.isDirectory() ? 'd' : 'f'

                    if (recurse && ftype == 'd') {
                        const c = this.listFiles(fullPath, pattern, true);
                        c.then((res) => {

                            const entry: FileEntry =
                            {
                                fullPath: fullPath,
                                name: fileName,
                                type: ftype,
                                children: res
                            };

                            if (callback)
                                callback(entry);

                            files.push(entry);
                        });
                    } else {

                        const entry: FileEntry =
                        {
                            fullPath: fullPath,
                            name: fileName,
                            type: ftype
                        };

                        if (callback)
                            callback(entry);

                        files.push(entry);
                    }
                } catch (e) {
                    this._logger.error(e);
                }
            });
        } catch (e) {
            this._logger.error(e);
        }

        return Promise.resolve(files);
    }

    // private async listFilesAsync(rootPath: string, pattern: string, recurse = false): Promise<FileEntry[]> {
    //     const files: FileEntry[] = [];

    //     try {

    //         const result = await globp(pattern, { cwd: rootPath, nodir: false });

    //         await result.forEach(async (fileName) => {

    //             try {
    //                 const fullPath = path.join(rootPath, fileName);
    //                 const info = fs.statSync(fullPath);
    //                 const ftype = info.isDirectory() ? 'd' : 'f'
    //                 let children: FileEntry[] = undefined;

    //                 if (recurse && ftype == 'd')
    //                     children = await this.listFiles(fullPath, pattern, true);

    //                 const entry: FileEntry =
    //                 {
    //                     fullPath: fullPath,
    //                     name: fileName,
    //                     type: ftype,
    //                     children: children
    //                 };

    //                 files.push(entry);
    //             } catch (e) {
    //                 this._logger.error(e);
    //             }
    //         });
    //     } catch (e) {
    //         this._logger.error(e);
    //     }

    //     return files;
    // }

    public async readFile(fullPath: string): Promise<Buffer> {
        const readFile = util.promisify(fs.readFile);
        return await readFile(fullPath);
    }

    public async writeFile(fullPath: string, contents: Buffer): Promise<void> {
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(fullPath, contents);
    }

    public async deleteFile(fullPath: string): Promise<void> {
        const deleteFile = util.promisify(fs.unlink);
        return deleteFile(fullPath);
    }

    public async renameFile(oldPath: string, newPath: string): Promise<void> {
        const renameFiles = util.promisify(fs.rename);
        await renameFiles(oldPath, newPath);
    }

    public async readFileLines(fullPath: string, lineProcessor: (ln: string, last: any) => boolean): Promise<void> {
        const eachLine = Promisex.promisify(lineReader.eachLine);
        await eachLine(fullPath, lineProcessor);
    }

    public fileExists(path: string): boolean {
        return fs.existsSync(path);
    }

    public pathExists(path: string): boolean {
        return fs.existsSync(path);
    }

    public async copyFile(sourcePath: string, targetPath: string): Promise<void> {
        const copyFile = util.promisify(fs.copyFile);
        await copyFile(sourcePath, targetPath);
    }

    public removeDirectory(path: string): void {
        fs.rmdirSync(path, {
            recursive: true,
        });
    }
}
