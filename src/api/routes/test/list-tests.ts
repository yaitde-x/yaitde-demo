import { FastifyInstance, FastifySchema } from "fastify";
import { AppConfig } from "../../../core/config";
import { ObjectType_Tests } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";
import { listObjectHandler } from "../common/list";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.get('/api/:repo/tests', {
        schema: <FastifySchema>{
            description: "lists the tests for the given user, workspace, and repo",
            tags: ['api', 'repo'],
            summary: "list test ids",
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
            await listObjectHandler(req, reply, logger, appConfig, ObjectType_Tests);
        });
}