import { FastifyInstance } from "fastify";
import { appConfig } from '../../core/config';
import * as fs from 'fs';
import * as path from 'path';

const util = require('util')
const fs_writeFile = util.promisify(fs.writeFile)

let requestSequence = 0;

const GIT_HEADER_EVENT: string = "X-GitHub-Event";
const GIT_EVENT_ID: string = "X-GitHub-Delivery";
const GIT_EVENT_SIG: string = "X-Hub-Signature-256";
const GIT_EVENT_UA: string = "User-Agent";

export default function (app: FastifyInstance) : void {
    app.post('/api/ops/gh/event', {
        schema: null
    },
        async (req, reply) => {
            try {
                const requestId = ++requestSequence;
                const requestPath = path.join(appConfig.automationPath, `request-${requestId}.json`);
                const headers = req.headers;

                // test change
                const payload: any = { headers: headers, payload: req.body };

                await fs_writeFile(requestPath, JSON.stringify(payload));

                reply.code(200).send();
            } catch (error) {
                reply.code(500).send();
            }
        });
}