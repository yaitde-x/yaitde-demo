import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ContentType_ApplicationJson } from "../../../core/const";
import { YaitdeTest } from "../../../core/domain/models";
import { ObjectNotFound } from "../../../core/errors/errors";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { readJsonFile } from "../../../core/utility";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.get('/api/:repo/test/:id', {
        schema: <FastifySchema>{
            description: "get the test for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "gets a test. duh.",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            querystring: {
                type: 'object',
                properties: {
                  expand: { type: 'boolean' }
                }
            },
            params: {
                repo: { type: "string", description: "the repo the test belongs to" },
                id: { type: "string", description: "the test id" }
            },
            response: {
                200: readJsonFile(appConfig.schemaRepoPath, "yaitde-test-full.json")
            }
        }
    },
        async (req, reply) => {
            try {
                const params: any = req.params;
                const expand: boolean = req.query["expand"] ?? false;
                const repo: string = params.repo;
                const testId: string = params.id;
                const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
                const userId = user ? user.userId : "anon";
                const instance = user ? user.instance : "default";
                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

                const fileApi = new LocalFileApi(logger, {});
                fileApi.ensurePathExists(instanceRepoRoot);

                const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
                const test = await yaitdeRepo.getTest(testId, expand);
                reply.code(200)
                    .type(ContentType_ApplicationJson)
                    .send(JSON.stringify(test));

            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}