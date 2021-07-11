import { IGitApi } from "./git-api/git-interfaces";
import { IFileApi } from "./file-api/file-interfaces";
import { IRunnerApi } from "./runner-api/runner-interfaces";
import { IOutlineApi } from "./import-api/kb-models";
import { ILogger } from "./utility/logger";
import { IYaitdeRepo } from "./yaitde-api/yaitde-repo";

// known env keys
export const repoKey = "repo";

export interface ApplicationContext {
   /**
   * ApplicationContext contains objects and state about the application for the life of a session.
   *
   */

    shutdown: boolean;
    readonly gitApi: IGitApi;
    readonly fileApi: IFileApi;
    readonly runnerApi: IRunnerApi;
    readonly outlineApi: IOutlineApi;
    readonly yaitdeRepo: IYaitdeRepo;
    readonly logger: ILogger;
    readonly envVars: any;
    readonly version: string;
}