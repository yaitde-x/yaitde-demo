import { FastifyInstance } from "fastify";
import { ApplicationInstance, TheOverseer } from "../orchestration/overseer";
import { Orchestrator } from "../orchestration/orchestrator";

export default function (app: FastifyInstance, theOverseer: TheOverseer, orchestrator: Orchestrator) : void {
    app.delete('/api/ops/rm', {
        schema: null
    },
        async (req, reply) => {
            try {

                const appInstance = <ApplicationInstance>req.body;
                const app = theOverseer.removeApplicationInstance(appInstance);
                let messages: string[] = [];

                if (app.imagePath) {
                    const result = await orchestrator.removeImage(app.imagePath);
                    if (!result.success)
                        messages = result.messages;
                }

                reply.status(200).send({ appInstance: app, messages: messages });
            } catch (error) {
                reply.status(500).send({ messages: [JSON.stringify(error)] });
            }
        });
}