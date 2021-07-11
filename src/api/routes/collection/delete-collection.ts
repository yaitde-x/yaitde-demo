import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.delete('/api/:repo/collection/:id', {
        schema: <FastifySchema>{
            description: "delete the specified collection for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "deletes a collection",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            querystring: {
                type: 'object',
                properties: {
                  cascade: { type: 'boolean' }
                }
            },
            params: {
                repo: { type: "string", description: "the repo the collection belongs to" },
                id: { type: "string", description: "the collection id" }
            },
            response: {
                204: {
                    description: 'Successful collection delete',
                    type: 'null'
                }
            }
        }
    },
        async (req, reply) => {
            try {
                const params: any = req.params;
                const repo: string = params.repo;
                const id: string = params.id;
                const cascade: boolean = req.query["cascade"] ?? false;
                const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
                const userId = user ? user.userId : "anon";
                const instance = user ? user.instance : "default";

                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

                const fileApi = new LocalFileApi(logger, {});
                fileApi.ensurePathExists(instanceRepoRoot);

                const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
                await yaitdeRepo.deleteCollection(id, cascade);
                reply.code(204)
                    .send();

            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}