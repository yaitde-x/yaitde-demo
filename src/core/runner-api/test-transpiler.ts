import { YaitdeCollection, YaitdeCollectionItem, YaitdeTest } from "../domain/models";
import { IFileApi } from "../file-api/file-interfaces";
import { toType } from "../utility";
import { getCamelCasedName } from "../utility/name-generators";

const walkTree = (children: YaitdeCollectionItem[], process: (node: YaitdeCollectionItem) => void): void => {
    for (const node of children) {
        process(node);
        
        if (node.children)
            walkTree(node.children, process);
    }
}

export class YaitdeTranspiler {
    private _fileApi: IFileApi;

    constructor(fileApi: IFileApi) {
        this._fileApi = fileApi;
    }

    private extractTests(collection: YaitdeCollection): YaitdeTest[] {
        const tests: YaitdeTest[] = [];

        if (collection.tree && collection.tree.children) {
            walkTree(collection.tree.children, (node) => {
                if (node.type === 'x') {
                    if (node.data) {
                        tests.push(toType<YaitdeTest>(node.data));
                    }
                }
                return node;
            });
        }

        return tests;
    }

    public async toScript(templatePath: string, collection: YaitdeCollection): Promise<string> {
        let scriptLines: string[] = [];
        const lineMap = [];
        const tests: YaitdeTest[] = this.extractTests(collection);

        await this._fileApi.readFileLines(templatePath, (ln, _) => {

            if (ln.startsWith("//###env")) {
                // just going to emit a static env for the moment
                scriptLines.push('');
                scriptLines.push('const env = {');
                scriptLines.push('    url: "https://linda.getoffmylawn.xyz",');
                scriptLines.push('    authUrl: "https://linda.getoffmylawn.xyz",');
                scriptLines.push('    token: "",');
                scriptLines.push('    user: "ks@yaitde.com",');
                scriptLines.push('    secret: "bQeThWmZq4t7w!z%C*F-JaNcRfUjXn2r",');
                scriptLines.push('    appId: "yaitde-mock-feature-ui-api-103",');
                scriptLines.push('}');
                scriptLines.push('');

            } else if (ln.startsWith("//###test")) {

                for (const test of tests) {
                    scriptLines = scriptLines.concat(this.emitTest(test));
                }

            } else if (ln.startsWith("//###collection")) {
                scriptLines.push(`const ${getCamelCasedName(collection.id)}_exec = async (pm: any, env: any) => {`);
                scriptLines.push(`    logger.log('running collection ${collection.id}...');`);

                for (const test of tests) {
                    scriptLines.push(`    // run ${test.id}`);
                    scriptLines.push(`    await ${getCamelCasedName(test.id)}_exec(pm, env);`);
                    scriptLines.push('');
                }

                scriptLines.push('};');
                scriptLines.push('');

                scriptLines.push('// entry point');
                scriptLines.push('export const runCollection = async (): Promise<any> => {');
                scriptLines.push('');
                scriptLines.push(`    await ${getCamelCasedName(collection.id)}_exec(pm, env);`);
                scriptLines.push('    return logger.logEntries;');
                scriptLines.push('};');
            } else {
                scriptLines.push(ln);
            }

            return true;
        });

        return scriptLines.join('\n');
    }

    private emitTest(test: YaitdeTest): string[] {
        let scriptLines: string[] = [];

        scriptLines.push(`// test: ${test.id} - ${test.description}`);
        scriptLines.push(`const ${getCamelCasedName(test.id)}_exec = async (pm: any, env: any) => {`);
        scriptLines.push(`    logger.log('running test ${test.id}...');`);
        scriptLines.push('');
        scriptLines.push(`    const method = processForEnv("${test.request.method}", env);`);
        scriptLines.push(`    const url = processForEnv("${test.request.url}", env);`);

        scriptLines.push('    const headers = {');
        for( let i = 0; i < test.request.headers.length; i++) {
            const header = test.request.headers[i];
            scriptLines.push(`      "${header.key}" : "${header.value}"` + 
                                (i === test.request.headers.length-1 ? "" : ","));
        }
        scriptLines.push('    };');

        // const headers = (JSON.stringify(test.request.headers, null, 4) + ";").split('\n');
        // scriptLines.push('    const headers = ' + headers[0]);
        // scriptLines = scriptLines.concat(headers.slice(1));

        scriptLines.push('');

        const bodyLines = (test.request.body.raw + ";").split('\n');
        scriptLines.push('    const body = ' + bodyLines[0]);
        scriptLines = scriptLines.concat(bodyLines.slice(1));

        scriptLines.push('');

        scriptLines.push('    const result = await executeHttpRequest(url, method, headers, body);');
        scriptLines.push('    pm.response = buildPmResponse(result);');
        scriptLines.push('');

        if (test.scripts.length > 0) {
            scriptLines.push('    try {');
            scriptLines.push('        /**********************************');
            scriptLines.push('         * Start of User Assertion script');
            scriptLines.push('         **********************************/');

            const script = test.scripts[0];
            const lines = script.data.split('\n');
            scriptLines = scriptLines.concat(lines);

            scriptLines.push('        /**********************************');
            scriptLines.push('         * End of User Assertion script');
            scriptLines.push('         **********************************/');
            scriptLines.push('    } catch (err) {');
            scriptLines.push('        logger.log(err);');
            scriptLines.push('    }');
        }

        scriptLines.push('};');

        return scriptLines;
    }
}