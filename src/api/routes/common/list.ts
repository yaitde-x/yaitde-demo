import { FastifyReply, FastifyRequest } from "fastify";
import { AppConfig } from "../../../core/config";
import { ContentType_ApplicationJson } from "../../../core/const";
import { generateErrorResponse } from "../../../core/fastify-utilities";
import { LocalFileApi } from "../../../core/file-api/file-api";
import { userRepoPathFactory, yaitdeUserFromEncodedString } from "../../../core/utility/factories";
import { YaitdeRepo } from "../../../core/yaitde-api/yaitde-repo";
import { ILogger } from "../../runner-core/logger";

export async function listObjectHandler(req: FastifyRequest, reply: FastifyReply, logger: ILogger,
    appConfig: AppConfig, objectType: string): Promise<void> {
    try {
        const params: any = req.params;
        const repo: string = params.repo;
        const user = yaitdeUserFromEncodedString(<string>req.headers["x-yaitde-user"]);
        const userId = user ? user.userId : "anon";
        const instance = user ? user.instance : "default";
        const instanceRepoRoot = userRepoPathFactory(appConfig.userRepoRoot, userId, instance, repo);

        const fileApi = new LocalFileApi(logger, {});
        fileApi.ensurePathExists(instanceRepoRoot);

        const yaitdeRepo = new YaitdeRepo(logger, fileApi, instanceRepoRoot);
        const models = await yaitdeRepo.listObjects(objectType);
        reply.code(200)
            .type(ContentType_ApplicationJson)
            .send(JSON.stringify(models));

    } catch (error) {
        generateErrorResponse(error, reply);
    }
}