import { FastifyInstance } from "fastify";
import { ILogger } from "../../runner-core/logger";
import { spawnSync } from 'child_process';

//var spawnSync = require('child_process').spawnSync;

export default function (app: FastifyInstance, logger: ILogger) {
    app.post('/api/run2', {
        schema: null
    },
        async (req, reply) => {
            try {

                const result = spawnSync('node',
                    ['build/test/sample-collection-run.js'],
                    {});

                if (result.status !== 0) {
                    reply.code(500).send(`${result.status} - {result.stderr.toString()}`);
                } else {
                    reply.code(200).send(result.stdout.toString());
                }

            } catch (error) {
                reply.code(500).send();
            }
        });
}