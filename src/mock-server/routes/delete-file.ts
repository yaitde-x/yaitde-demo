import { FastifyInstance, FastifySchema } from 'fastify';
import fs from 'fs';
import path from 'path';
import { getBasePathForDomain } from '../../core/config';

export default async function (app: FastifyInstance) : Promise<void> {
    app.delete('/api/:domain/*', {
        schema: <FastifySchema>{
            description: "delete file from the mock repository",
            tags: ['mock'],
            summary: "You can use this endpoint to cleanup files at the end of a test run, etc.",
            security: [{ BearerAuth: [] }],
            params: {
                domain: { type: "string", description: "just a way to categorize the data really" },
                "*": { type: "string", description: "relative path into the mock repository" }
            }
        }
    }, async (req, reply) => {
        const r: any = req.params;
        const fullPath = path.join(getBasePathForDomain(r.domain), r["*"]);
        fs.unlinkSync(fullPath);
        return { "result": "success" };
    });
}