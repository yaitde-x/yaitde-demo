import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ContentType_ApplicationJson } from "../../../core/const";
import { YaitdeCollection } from "../../../core/domain/models";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { readJsonFile } from "../../../core/utility";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.post('/api/:repo/collection', {
        schema: <FastifySchema>{
            description: "writes a collection for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "writes a collection to the repo and responds with the collection id. auto-assigned if required",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            params: {
                repo: { type: "string", description: "the repo the collection should be written to" }
            },
            body: readJsonFile(appConfig.schemaRepoPath, "yaitde-col-full.json"),
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
                const model = <YaitdeCollection>req.body;
                const originalId = model.id;
                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

                const fileApi = new LocalFileApi(logger, {});
                fileApi.ensurePathExists(instanceRepoRoot);

                const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
                const id = await yaitdeRepo.writeCollection(model);

                reply.code(originalId !== id ? 201 : 200)
                    .type(ContentType_ApplicationJson)
                    .send({ id: id });

            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}