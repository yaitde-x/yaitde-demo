import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ObjectType_Environments } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";
import { listObjectHandler } from "../common/list";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.get('/api/:repo/environments', {
        schema: <FastifySchema>{
            description: "lists the environments for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "list environment ids",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            params: {
                repo: { type: "string", description: "the repo to query" },
            },
            response: {
                200: {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
        async (req, reply) => {
            await listObjectHandler(req, reply, logger, appConfig, ObjectType_Environments);
        });
}