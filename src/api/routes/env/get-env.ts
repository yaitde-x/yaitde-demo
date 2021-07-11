import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ContentType_ApplicationJson } from "../../../core/const";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { readJsonFile } from "../../../core/utility";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.get('/api/:repo/environment/:id', {
        schema: <FastifySchema>{
            description: "get and environment for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "gets an environment. duh.",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            params: {
                repo: { type: "string", description: "the repo the environment belongs to" },
                id: { type: "string", description: "the environment id" }
            },
            response: {
                200: readJsonFile(appConfig.schemaRepoPath, "yaitde-env-full.json")
            }
        }
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
                const test = await yaitdeRepo.getEnvironment(id);
                reply.code(200)
                    .type(ContentType_ApplicationJson)
                    .send(JSON.stringify(test));

            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}