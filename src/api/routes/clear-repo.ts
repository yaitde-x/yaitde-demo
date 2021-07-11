import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../core/config";
import { generateErrorResponse } from "../../core/fastify-utilities";
import { LocalFileApi } from "../../core/file-api/file-api";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../core/utility/factories";
import { ILogger } from "../runner-core/logger";
import { listObjectHandler } from "./common/list";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.delete('/api/:repo/clear', {
        schema: <FastifySchema>{
            description: "deletes the repo from the user's workspace",
            tags: ['api', 'repo'],
            summary: "deletes a repo",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            params: {
                repo: { type: "string", description: "the repo to delete" },
            },
            response: {
                204: {
                    description: 'Successful repo delete',
                    type: 'null'
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
                const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);
        
                const fileApi = new LocalFileApi(logger, {});
                fileApi.removeDirectory(instanceRepoRoot);
                
                reply.code(204)
                    .send();
        
            } catch (error) {
                generateErrorResponse(error, reply);
            }
        });
}