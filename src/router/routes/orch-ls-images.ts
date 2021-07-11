import { FastifyInstance } from "fastify";
import { Orchestrator } from "../orchestration/orchestrator";

export default function (app: FastifyInstance, orchestrator: Orchestrator): void {
    app.get('/api/ops/images', {
        schema: null
    },
        async (req, reply) => {
            try {

                const result = await orchestrator.getImages();

                if (result.success)
                    reply.status(200).send(result.result);
                else
                    reply.status(500).send(result);

            } catch (error) {
                reply.status(500).send({ messages: [JSON.stringify(error)] });
            }
        });
}