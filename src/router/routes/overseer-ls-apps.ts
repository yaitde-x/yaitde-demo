import { FastifyInstance } from "fastify";
import { ApplicationInstance, TheOverseer } from "../orchestration/overseer";

const buildRunAs = (agentType: string, appInstance: ApplicationInstance): string => {
    if (appInstance.buildId && appInstance.buildId.length > 0)
        return `yaitde-${agentType}-${appInstance.branchId}-${appInstance.buildId}`;

    return `yaitde-${agentType}-${appInstance.branchId}`;
};

export default function (app: FastifyInstance, theOverseer: TheOverseer) : void {
    app.get('/api/ops/ls', {
        schema: null
    },
        async (req, reply) => {
            try {

                const apps = theOverseer.getKnownApps();

                for (const app of apps) {
                    const item = <any>app;

                    item.runAs = [
                        buildRunAs("mock", app),
                        buildRunAs("api", app)
                    ];
                }

                reply.status(200).send(apps);
            } catch (error) {
                reply.status(500).send({ messages: [JSON.stringify(error)] });
            }
        });
}