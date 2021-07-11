import { FastifyInstance } from "fastify";
import { ILogger } from "../../runner-core/logger";
import { YaitdeTranspiler } from "../../../core/runner-api/test-transpiler";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { AppConfig } from "../../../core/config";
import path from "path";
import { spawnSync } from 'child_process';

interface SpawnResult {
    status: number;
}

const runProcess = (processToRun: string, params: string[], cwd: string): any => {
    try {
        const result = spawnSync(processToRun, params, { cwd: cwd });
        return result;
    } catch (e) {
        throw new Error(`error executing ${processToRun} ${JSON.stringify(params)}`);
    }
}


export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.post('/api/:repo/run/:id', {
        schema: null
    },
        async (req, reply) => {
            try {

                const params: any = req.params;
                const repo: string = params.repo;
                const id: string = params.id;

                const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
                const userId = user ? user.userId : "anon";
                const instance = user ? user.instance : "default";
                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

                const fileApi = new LocalFileApi(logger, {});
                fileApi.ensurePathExists(instanceRepoRoot);

                const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
                const collection = await yaitdeRepo.getCollection(id, true);

                const templatePath = path.join(appConfig.systemPath, 'runner-template.ts');
                const testTranspiler = new YaitdeTranspiler(fileApi);
                const testScript = await testTranspiler.toScript(templatePath, collection);

                const buildOutPath = path.join(instanceRepoRoot, ".yaitde", "cache", id);
                const initCache = !fileApi.pathExists(buildOutPath);

                fileApi.ensurePathExists(path.join(buildOutPath, "src"));
                const scriptFile = path.join(buildOutPath, "src", "main.ts");
                fileApi.writeFile(scriptFile, Buffer.from(testScript));

                if (initCache) {
                    // copy the package.json
                    fileApi.copyFile(path.join(appConfig.systemPath, "package.json"),
                        path.join(buildOutPath, "package.json"));

                    // copy the tsconfig.json
                    fileApi.copyFile(path.join(appConfig.systemPath, "tsconfig.json"),
                        path.join(buildOutPath, "tsconfig.json"));

                    // install the packages
                    const npmInstall = runProcess("npm", ["i"], buildOutPath);
                    if (npmInstall.status !== 0) {
                        reply.code(500).send(npmInstall.stderr);
                        return;
                    }
                }

                const npmCompile = runProcess("npm", ["run", "compile"], buildOutPath);
                //const npmCompile = runProcess("npx", ["tsc"], buildOutPath);
                console.log('stdout:' + npmCompile.stdout);
                console.log('stderr:' + npmCompile.stderr);

                if (npmCompile.status !== 0) {
                    reply.code(500).send(npmCompile.stderr);
                    return;
                }

                const result = runProcess('node', ['build/main.js'], buildOutPath);
                if (result.status !== 0) {
                    reply.code(500).send(result.stderr);
                    return;
                } else {
                    const output = result.stdout;
                    const err = result.stderr;

                    reply.code(200)
                        .type('application/text')
                        .send(result.stdout.length === 0 ? result.stderr : result.stdout);
                }

            } catch (error) {
                reply.code(500).send();
            }
        });
}