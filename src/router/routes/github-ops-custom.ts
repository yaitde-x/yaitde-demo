import { FastifyInstance } from "fastify";
import { appConfig } from '../../core/config';
import * as fs from 'fs';
import * as path from 'path';
import { ApplicationInstance, TheOverseer } from "../orchestration/overseer";

const util = require('util')
const fs_writeFile = util.promisify(fs.writeFile)

let requestSequence = 0;

export default function (app: FastifyInstance, theOverseer: TheOverseer): void {
    app.post('/api/ops/gh/custom', {
        schema: null
    },
        async (req, reply) => {
            try {
                const requestId = ++requestSequence;
                const requestPath = path.join(appConfig.automationPath, `customreq-${requestId}.json`);
                const headers = req.headers;
                const body: any = req.body;
                const appInstance: ApplicationInstance = {
                    applicationId: "yaitde-agent",
                    branchId: body.data.applicationName,
                    buildId: body.data.buildId,
                    imagePath: body.data.imagePath
                };

                theOverseer.addApplicationInstance(appInstance);

                // test change
                const payload: any = { headers: headers, payload: req.body };

                await fs_writeFile(requestPath, JSON.stringify(payload));

                reply.code(200).send();
            } catch (error) {
                reply.code(500).send();
            }
        });
}