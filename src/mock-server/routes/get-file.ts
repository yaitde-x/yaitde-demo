import fs from 'fs';
import { getBasePathForDomain } from '../../core/config';
import path from 'path';
import { FastifyInstance, FastifySchema } from 'fastify';

export default async function (app: FastifyInstance) : Promise<void> {
    app.get('/api/:domain/*', {
        schema: <FastifySchema>{
            description: "returns a file from the mock repository",
            tags: ['mock'],
            summary: "the contents of the file in the repository is in the body of the response",
            security: [{ BearerAuth: [] }],
            params: {
                domain: { type: "string", description: "just a way to categorize the data really" },
                "*": { type: "string", description: "relative path into the mock repository" }
            }
        }
    }, async (req, reply) => {
        const r: any = req.params;
        const fullPath = path.join(getBasePathForDomain(r.domain), r["*"]);

        if (fs.existsSync(fullPath)) {

            let contentType = "application/text";
            if (fullPath.toLowerCase().endsWith(".json"))
                contentType = "application/json";
            else if (fullPath.toLowerCase().endsWith(".xml"))
                contentType = "application/xml";

            reply.status(200).header("Content-Type", contentType).send(fs.readFileSync(fullPath))
        } else {
            reply.status(404).send();
        }
    });
}