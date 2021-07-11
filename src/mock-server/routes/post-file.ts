import { FastifyInstance, FastifySchema } from 'fastify';
import fs from 'fs';
import path from 'path';            
import { getBasePathForDomain } from '../../core/config';

export default async function (app: FastifyInstance) {
    app.post('/api/:domain/*', {
        schema: <FastifySchema>{
            description: "saves a file into the mock data repository",
            tags: ['mock'],
            security: [{ BearerAuth: [] }],
            params: {
                domain: { type: "string", description: "just a way to categorize the data really" },
                "*": { type: "string", description: "relative path into the mock repository" }
            }
        }
    },
        async (req, reply) => {
            const r: any = req.params;
            const fullPath = path.join(getBasePathForDomain(r.domain), r["*"]);
            const pathOnly = path.dirname(fullPath).toString();
            fs.mkdirSync(pathOnly, { recursive: true });
            fs.writeFileSync(fullPath, <string>req.body);
            return { "result": "success" };
        });
}