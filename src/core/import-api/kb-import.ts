import * as path from 'path';
import { FileEntry, IFileApi } from "../file-api/file-interfaces";
import { ILogger } from "../utility/logger";
import { ImportResult, IOutlineApi, OutlineDocumentStub } from "./kb-models";


export class DocsToOutline {
    private _fileApi: IFileApi;
    private _logger: ILogger;
    private _outlineApi: IOutlineApi;
    private _docsProcessed = 0;
    private _collectionsCreated = 0;
    private _foldersCreated = 0;
    private _docLimit = 10;

    constructor(fileApi: IFileApi, outlineApi: IOutlineApi, logger: ILogger) {
        this._fileApi = fileApi;
        this._logger = logger;
        this._outlineApi = outlineApi;
    }

    public async importDocs(rootPath: string): Promise<ImportResult> {

        try {
            this._logger.info('Importing docs from ' + rootPath + ' to ' + this._outlineApi.getUrl());
            const results = await this._fileApi.listFiles(rootPath, "*", true);

            if (results && results.length > 0) {
                await this.processFiles(results, undefined, undefined);
            }

            const importResult: ImportResult = {
                docsProcessed: this._docsProcessed,
                collectionsCreated: this._collectionsCreated,
                foldersCreated: this._foldersCreated,
                result: "success"
            };

            return importResult;
        } catch (err) {
            return { result: err };
        }
    }

    private async processFiles(files: FileEntry[], collectionId: string, parentId?: string): Promise<void> {
        try {
            for (const entry of files) {
                if (this._docLimit !== -1 && this._docsProcessed > this._docLimit)
                    return;

                if (entry.type === "d" && this.isACollection(entry.name)) {
                    if (this.processThisCollection(entry.name)) {
                        // need to create  collection
                        const collection = await this._outlineApi.createCollection({
                            name: entry.name + "-junk",
                            description: "created by the borg... all your data are belong to us"
                        });
                        this._collectionsCreated++;
                        await this.processFiles(entry.children, collection.id, undefined);
                    }
                } else if (entry.type === "d") {
                    const doc = await this._outlineApi.createDocument({
                        title: entry.name,
                        collectionId: collectionId,
                        publish: true
                    });

                    this._foldersCreated++;
                    await this.processFiles(entry.children, collectionId, doc.id);
                } else if (entry.name.endsWith(".md")) {

                    if (collectionId) {
                        const transform = new MarkdownToOutlineDocument(this._fileApi, this._logger);
                        const model = await transform.Transform(entry.fullPath, collectionId, parentId, true);

                        if (entry.name.toLowerCase() === "readme.md") {
                            // if there is no parent id, it is probably the top level doc
                            if (parentId) {
                                // this is the parents content
                                const parentDoc = await this._outlineApi.getDocument(parentId);
                                parentDoc.text = model.text;
                                await this._outlineApi.updateDocument(parentDoc);
                            }
                        } else {
                            await this._outlineApi.createDocument(model);
                            this._docsProcessed++;
                        }
                    }
                }
            }
        } catch (err) {
            this._logger.error(err);
        }
    }

    private processThisCollection(name: string) {
        //return true;
        return name.toLowerCase() === "architecture";
    }

    private isACollection(name: string): boolean {
        const buf = name.toLowerCase();
        if (buf === 'architecture'
            || buf === "business"
            || buf === "dev-opsy-stuff"
            || buf === "policy-and-process") {
            return true;
        }

        return false;
    }
}

export class MarkdownToOutlineDocument {
    private _fileApi: IFileApi;
    private _logger: ILogger;

    constructor(fileApi: IFileApi, logger: ILogger) {
        this._fileApi = fileApi;
        this._logger = logger;
    }

    public async Transform(pathToDocument: string, collectionId: string, parentId: string, publish: boolean): Promise<OutlineDocumentStub> {

        try {

            this._logger.info("transforming " + pathToDocument + "...");

            let title: string = path.basename(pathToDocument, ".md");
            let body = "";
            let inBlock = false;

            await this._fileApi.readFileLines(pathToDocument, (ln: string, last: any): boolean => {

                if (ln.startsWith("```"))
                    inBlock = !inBlock;

                if (ln.startsWith("# ") && !inBlock)
                    title = ln.substr(2);
                else if (ln.trim().toLowerCase() === "<br>" && !inBlock) {
                    body = body + "&nbsp;\n";
                } else if (ln.trim().toLowerCase() === "<br/>" && !inBlock) {
                    body = body + "&nbsp;\n";
                }
                else if (ln.trim() === "" && !inBlock) {
                    body = body + "\n";
                } else
                    body = body + ln + "\n";

                return true;
            });

            const doc: OutlineDocumentStub = {
                title: title,
                text: body,
                collectionId: collectionId,
                parentDocumentId: parentId,
                publish: publish
            };

            return doc;
        } catch (err) {
            this._logger.error(err);
        }
    }
}