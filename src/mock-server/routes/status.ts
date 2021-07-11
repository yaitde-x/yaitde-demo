import { FastifyInstance, FastifySchema } from "fastify";

export default async function (app: FastifyInstance) : Promise<void> {
    app.all('/api/status/:statusCode',{
        schema: <FastifySchema> {
            description: "returns the HTTP status code you tell it to.",
            tags: ['mock'],
            security: [{ BearerAuth : [] }],
            params: {
                statusCode : { type: "integer", description: "the status code you want returned" }
            }
        }
    }, 
    async (req, reply) => {
        const statusCode = req.params["statusCode"];
        reply.code(statusCode).send();
    });
}