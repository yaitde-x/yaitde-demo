import { FastifyInstance } from "fastify";
import path from 'path';
import { ILogger } from "../../runner-core/logger";
import { PostmanCollection, PostmanImport } from "../../../core/import-api/postman-models";
import { PostmanToYaitdeTransform } from "../../../core/import-api/postman-transform";
import { AppConfig } from "../../../core/config";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";

export default function (app: FastifyInstance, logger: ILogger, appConfig: AppConfig) {
    app.post('/api/:repo/import/collection', {
        schema: null
    },
        async (req, reply) => {
            try {
                const params: any = req.params;
                const format: string = req.query["format"];
                const write: boolean = req.query["write"] ?? false;
                const repo: string = params.repo;
                const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
                const userId = user ? user.userId : "anon";
                const instance = user ? user.instance : "default";

                if (format === "pm") {
                    const col = <PostmanCollection>req.body;
                    const transform = new PostmanToYaitdeTransform();
                    const yaitdeModels = transform.toYaitdeCollection(col);

                    if (write) {
                        const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot,userId, instance, repo);
                        const fileApi = new LocalFileApi(logger, {});
                        fileApi.ensurePathExists(instanceRepoRoot);

                        const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);

                        await yaitdeRepo.writeCollection(yaitdeModels.collection);
                        await yaitdeRepo.writeTests(yaitdeModels.tests);
                    }

                    reply.code(200).send(yaitdeModels);
                } else {
                    reply.code(400).send({ messages: ["only understand the pm format atm"] });
                }
            } catch (error) {
                reply.code(500).send();
            }
        });
}