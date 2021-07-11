import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ContentType_ApplicationJson } from "../../../core/const";
import { YaitdeTest } from "../../../core/domain/models";
import { Environment } from "../../../core/env/env-interfaces";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { readJsonFile } from "../../../core/utility";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.post('/api/:repo/environment', {
        schema: <FastifySchema>{
            description: "writes an environment for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "writes a test to the repo and responds with the test id. auto-assigned if required",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            params: {
                repo: { type: "string", description: "the repo the environment should be written to" }
            },
            body: readJsonFile(appConfig.schemaRepoPath, "yaitde-env-full.json"),
            response: {
                200: {
                    type: "object",
                    properties: {
                        "id": {
                            "type": "string"
                        }
                    }
                },
                201: {
                    type: "object",
                    properties: {
                        "id": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
        async (req, reply) => {
            try {
                const params: any = req.params;
                const repo: string = params.repo;
                const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
                const userId = user ? user.userId : "anon";
                const instance = user ? user.instance : "default";
                const env = <Environment>req.body;
                const originalId = env.id;
                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

                const fileApi = new LocalFileApi(logger, {});
                fileApi.ensurePathExists(instanceRepoRoot);

                const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
                const id = await yaitdeRepo.writeEnvironment(env);

                reply.code(originalId !== id ? 201 : 200)
                    .type(ContentType_ApplicationJson)
                    .send({ id: id });

            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}