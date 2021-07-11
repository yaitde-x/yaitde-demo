import * as path from "path";
import { ModelIdentity, YaitdeCollection, YaitdeCollectionItem, YaitdeScript, YaitdeTest } from "../domain/models";
import { Environment } from "../env/env-interfaces";
import { InvalidObjectId, ObjectNotFound } from "../errors/errors";
import { IFileApi } from "../file-api/file-interfaces";
import { toType } from "../utility";
import { ILogger } from "../utility/logger";
import { getRandomName } from "../utility/name-generators";

const ObjectExtension = ".json";

export const ObjectType_Collections = "collections";
export const ObjectType_Tests = "tests";
export const ObjectType_Scripts = "scripts";
export const ObjectType_Environments = "environments";

const ObjectVerb_Collections = "collects";
const ObjectVerb_Tests = "tests";
const ObjectVerb_Scripts = "executes";
const ObjectVerb_Environments = "scopes";

export interface IYaitdeRepo {

    setRepoPath(repoPath: string) : void;
    listObjects(objectType: string): Promise<string[]>;

    writeTest(model: YaitdeTest): Promise<string>;
    writeTests(models: YaitdeTest[]): Promise<string[]>;
    getTest(id: string, expand: boolean): Promise<YaitdeTest>;
    deleteTest(id: string, cascade: boolean): Promise<void>;

    writeScript(model: YaitdeScript): Promise<string>;
    writeScripts(models: YaitdeScript[]): Promise<string[]>;
    getScript(id: string): Promise<YaitdeScript>;
    deleteScript(id: string): Promise<void>;

    writeEnvironment(model: Environment): Promise<string>;
    writeEnvironments(models: Environment[]): Promise<string[]>;
    getEnvironment(id: string): Promise<Environment>;
    deleteEnvironment(id: string): Promise<void>;

    writeCollection(model: YaitdeCollection): Promise<string>;
    writeCollections(models: YaitdeCollection[]): Promise<string[]>;
    getCollection(id: string, expand: boolean): Promise<YaitdeCollection>;
    deleteCollection(id: string, cascade: boolean): Promise<void>;
}

export class YaitdeRepo implements IYaitdeRepo {
    private _logger: ILogger;
    private _fileApi: IFileApi;
    private _repoBasePath: string;

    constructor(logger: ILogger, fileApi: IFileApi, repoBasePath: string) {
        this._logger = logger;
        this._fileApi = fileApi;
        this._repoBasePath = repoBasePath;
    }

    private objectExistsInRepo(objectType: string, modelId: string): boolean {
        const fullPath = path.join(this._repoBasePath, objectType, modelId + ObjectExtension);
        return this._fileApi.fileExists(fullPath);
    }

    public setRepoPath(repoPath: string) : void {
        this._repoBasePath = repoPath;
    }

    private getObjectPath(objectType: string, fileName: string): string {
        const pth = path.join(this._repoBasePath, objectType);
        this._fileApi.ensurePathExists(pth);
        return path.join(pth, fileName);
    }

    private getUniqueName(objectType: string, verb: string): string {
        let name = getRandomName("", "");
        let serial = 0;
        let path = this.getObjectPath(objectType, name + ObjectExtension);

        while (this._fileApi.fileExists(path)) {
            name = `${name}-${++serial}`;
            path = this.getObjectPath(objectType, name + ObjectExtension);
        }

        return name;
    }

    private getCollectionPath(fileName: string): string {
        return this.getObjectPath(ObjectType_Collections, fileName);
    }

    private getTestPath(fileName: string): string {
        return this.getObjectPath(ObjectType_Tests, fileName);
    }

    private getEnvironmentPath(fileName: string): string {
        return this.getObjectPath(ObjectType_Environments, fileName);
    }

    private getScriptPath(fileName: string): string {
        return this.getObjectPath(ObjectType_Scripts, fileName);
    }

    public async writeCollections(models: YaitdeCollection[]): Promise<string[]> {
        const ids: string[] = [];
        for (const idx in models) {
            const model = models[idx];
            ids.push(await this.writeCollection(model));
        }
        return ids;
    }

    public async listObjects(objectType: string): Promise<string[]> {
        const files = await this._fileApi.listFiles(path.join(this._repoBasePath, objectType), "*");
        const result: string[] = [];

        for (const entry of files) {
            result.push(entry.name.replace(ObjectExtension, ""));
        }

        return result;
    }

    public async writeCollection(model: YaitdeCollection): Promise<string> {
        this._logger.info(`writing collection ${model.id}`);

        this.ensureId(model, ObjectType_Collections, ObjectVerb_Collections);

        const fullPath = this.getCollectionPath(model.id + ObjectExtension);

        if (model.tree && model.tree.children) {
            await this.processTree(model.tree.children, async (node) => {
                if (node.type === 'x') {

                    if (node.data) {
                        const test = toType<YaitdeTest>(node.data);
                        node.resourceId = await this.writeTest(test);
                        delete node.data;
                    } else if (node.resourceId) {
                        if (!this.objectExistsInRepo(ObjectType_Tests, node.resourceId)) {
                            throw new InvalidObjectId(`test ${node.resourceId} does not exist`,
                                ObjectType_Tests, node.resourceId);
                        }

                    }
                }
                return node;
            });
        }

        const json = JSON.stringify(model);
        await this._fileApi.writeFile(fullPath, Buffer.from(json));

        return model.id;
    }

    private async processTree(children: YaitdeCollectionItem[], process: (node: YaitdeCollectionItem) => Promise<YaitdeCollectionItem>): Promise<YaitdeCollectionItem[]> {
        const newChildren: YaitdeCollectionItem[] = [];

        for (const node of children) {
            const newNode = await process(node);

            if (node.children)
                newNode.children = await this.processTree(node.children, process);

            newChildren.push(newNode)
        }

        return newChildren;
    }

    public async getCollection(id: string, expand: boolean = false): Promise<YaitdeCollection> {
        try {
            this._logger.info(`retrieving collection ${id}`);
            const objectPath = this.getCollectionPath(id + ObjectExtension);
            const result = await this._fileApi.readFile(objectPath);
            const collection = <YaitdeCollection>JSON.parse(result.toString());

            if (expand && collection && collection.tree && collection.tree.children) {
                collection.tree.children = await this.processTree(collection.tree.children,
                    async (node) => {
                        if (node.type === 'x')
                            node.data = await this.getTest(node.resourceId, true);
                        return node;
                    });
            }

            return collection;
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`collection ${id} was not found`)
            throw err;
        }
    }

    public async deleteCollection(id: string, cascade: boolean = false): Promise<void> {
        try {
            this._logger.info(`deleting collection ${id}`);
            const objectPath = this.getCollectionPath(id + ObjectExtension);

            if (cascade) {
                const model = await this.getCollection(id);

                if (model && model.tree && model.tree.children) {
                    this.processTree(model.tree.children, async (node) => {
                        if (node.type === 'x' && node.resourceId) {
                            if (this.objectExistsInRepo(ObjectType_Tests, node.resourceId)) {
                                await this.deleteTest(node.resourceId, cascade);
                            }
                        }
                        return node;
                    })
                }
            }

            await this._fileApi.deleteFile(objectPath);
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`collection ${id} was not found`)
            throw err;
        }
    }

    public async writeTests(models: YaitdeTest[]): Promise<string[]> {
        const testIds: string[] = [];
        for (const idx in models) {
            const test = models[idx];
            testIds.push(await this.writeTest(test));
        }
        return testIds;
    }

    public async writeTest(model: YaitdeTest): Promise<string> {

        this.ensureId(model, ObjectType_Tests, ObjectVerb_Tests);

        const testPath = this.getTestPath(model.id + ObjectExtension);
        const scripts: string[] = [];

        this._logger.info(`writeTest(${model.id})...`);

        if (model.scripts) {


            for (const idx in model.scripts) {

                if ((typeof model.scripts[idx] === 'string' || model.scripts[idx] instanceof String)) {
                    const scriptId = toType<string>(model.scripts[idx]);
                    if (!this.objectExistsInRepo(ObjectType_Scripts, scriptId)) {
                        throw new InvalidObjectId(`script ${scriptId} does not exist`, ObjectType_Scripts, scriptId)
                    }
                } else {
                    const script = model.scripts[idx];

                    this.ensureId(script, ObjectType_Scripts, ObjectVerb_Scripts);

                    scripts.push(script.id);

                    const scriptPath = this.getScriptPath(script.id + ObjectExtension);

                    const scriptJson = JSON.stringify(script);
                    this._logger.info(`writing child script ${script.id} to ${scriptPath}...`);
                    await this._fileApi.writeFile(scriptPath, Buffer.from(scriptJson));
                }
            }
        }

        const coreTest = {
            id: model.id,
            request: model.request,
            description: model.description,
            scripts: scripts
        };

        const testJson = JSON.stringify(coreTest);
        await this._fileApi.writeFile(testPath, Buffer.from(testJson));
        this._logger.info(`writeTest(${model.id}) done.`);
        return model.id;
    }

    public async getTest(id: string, expand: boolean = false): Promise<YaitdeTest> {
        try {
            this._logger.info(`retrieving test ${id}`);
            const testPath = this.getTestPath(id + ObjectExtension);
            const result = await this._fileApi.readFile(testPath);
            const test = <YaitdeTest>JSON.parse(result.toString());

            if (expand && test && test.scripts) {
                const scriptIds = toType<string[]>(test.scripts);
                test.scripts = [];

                for (const scriptId of scriptIds)
                    test.scripts.push(await this.getScript(scriptId));
            }
            return test;
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`test ${id} was not found`)
            throw err;
        }
    }

    public async deleteTest(id: string, cascade: boolean = false): Promise<void> {

        try {
            this._logger.info(`deleting test ${id}`);
            const testPath = this.getTestPath(id + ObjectExtension);

            if (cascade) {
                const test = await this.getTest(id);
                if (test.scripts) {
                    const scriptIds = toType<string[]>(test.scripts);
                    for (const scriptId of scriptIds) {
                        if (this.objectExistsInRepo(ObjectType_Scripts, scriptId)) {
                            await this.deleteScript(scriptId);
                        }
                    }
                }
            }
            await this._fileApi.deleteFile(testPath);
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`test ${id} was not found`)
            throw err;
        }
    }

    public async writeEnvironments(models: Environment[]): Promise<string[]> {
        const ids: string[] = [];
        for (const idx in models) {
            const model = models[idx];
            ids.push(await this.writeEnvironment(model));
        }
        return ids;
    }

    public async writeEnvironment(model: Environment): Promise<string> {

        this.ensureId(model, ObjectType_Environments, ObjectVerb_Environments);

        const objectPath = this.getEnvironmentPath(model.id + ObjectExtension);

        this._logger.info(`writeEnvironment(${model.id})...`);

        const buf = JSON.stringify(model);
        await this._fileApi.writeFile(objectPath, Buffer.from(buf));
        this._logger.info(`writeEnvironment(${model.id}) done.`);
        return model.id;
    }

    public async getEnvironment(id: string): Promise<Environment> {
        try {
            this._logger.info(`retrieving environment ${id}`);
            const objectPath = this.getEnvironmentPath(id + ObjectExtension);
            const result = await this._fileApi.readFile(objectPath);
            return <Environment>JSON.parse(result.toString());
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`environment ${id} was not found`)
            throw err;
        }
    }

    public async deleteEnvironment(id: string): Promise<void> {
        try {
            this._logger.info(`deleting environment ${id}`);
            const objectPath = this.getEnvironmentPath(id + ObjectExtension);
            await this._fileApi.deleteFile(objectPath);
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`environment ${id} was not found`)
            throw err;
        }
    }

    public async writeScripts(models: YaitdeScript[]): Promise<string[]> {
        const ids: string[] = [];
        for (const idx in models) {
            const model = models[idx];
            ids.push(await this.writeObject(model, "Script", this.getScriptPath(model.id + ObjectExtension)));
        }
        return ids;
    }

    public async writeScript(model: YaitdeScript): Promise<string> {
        this.ensureId(model, ObjectType_Scripts, ObjectVerb_Scripts);
        return await this.writeObject(model, "script", this.getScriptPath(model.id + ObjectExtension));
    }

    public async getScript(id: string): Promise<YaitdeScript> {
        return await this.getObject(id, "script", this.getScriptPath(id + ObjectExtension));
    }

    public async deleteScript(id: string): Promise<void> {
        await this.deleteObject(id, "script", this.getScriptPath(id + ObjectExtension))
    }

    public async writeObjects<T extends ModelIdentity>(models: T[], objectName: string, objectPath: string): Promise<string[]> {
        const ids: string[] = [];
        for (const idx in models) {
            const model = models[idx];
            ids.push(await this.writeObject(model, objectName, objectPath));
        }
        return ids;
    }

    public async writeObject<T extends ModelIdentity>(model: T, objectName: string, objectPath: string): Promise<string> {
        this._logger.info(`write${objectName}(${model.id})...`);

        const buf = JSON.stringify(model);
        await this._fileApi.writeFile(objectPath, Buffer.from(buf));
        this._logger.info(`write${objectName}(${model.id}) done.`);
        return model.id;
    }

    public async getObject<T extends ModelIdentity>(id: string, objectName: string, objectPath: string): Promise<T> {
        try {
            this._logger.info(`retrieving ${objectName} - ${id}...`);
            const result = await this._fileApi.readFile(objectPath);
            return <T>JSON.parse(result.toString());
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`${objectName} - ${id} was not found`)
            throw err;
        }
    }

    public async deleteObject(id: string, objectName: string, objectPath: string): Promise<void> {
        try {
            this._logger.info(`deleting ${objectName} - ${id}...`);

            await this._fileApi.deleteFile(objectPath);
        } catch (err) {
            if (err.errno === -2)
                throw new ObjectNotFound(`${objectName} - ${id} was not found`)
            throw err;
        }
    }

    private ensureId(model: ModelIdentity, objectType: string, verb: string): void {
        if (!model.id || model.id === "")
            model.id = this.getUniqueName(objectType, verb);
    }
}
