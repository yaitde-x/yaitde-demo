import { FastifyInstance, FastifySchema } from 'fastify';
import { readJsonFile } from '../../core/utility';
import { appConfig } from '../../core/config';

export default async function (app: FastifyInstance) : Promise<void> {
    app.all('/api/echo', {
        schema: <FastifySchema>{
            description: "echoes what you send it",
            tags: ['mock'],
            summary: "responds with a model that contains all the things you sent it",
            security: [{ BearerAuth: [{ "Authorization": "Bearer  {{token}}" }] }],
            response : {
                200: readJsonFile(appConfig.schemaRepoPath, "echo-resp.json")
            }
        }
    },
        async (req, reply) => {
            return {
                method: req.method,
                params: req.params,
                headers: req.headers,
                body: req.body,
                diag: {
                    message: "this is a test from master-64"
                }
            };
        });
}