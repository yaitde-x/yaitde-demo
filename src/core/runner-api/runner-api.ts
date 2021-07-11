import * as spawn from 'await-spawn';
import { IRunnerApi, IRunnerResult } from "./runner-interfaces";
import { ILogger } from '../utility/logger';
import { repoKey } from '../app';
import { YaitdeRunnerConfig } from '../config';
import { repoPathFromEnvironment } from '../utility/factories';

export class RunnerApi implements IRunnerApi {

    private _logger: ILogger;
    private _environment: any;
    private _runnerConfig: YaitdeRunnerConfig;

    constructor(logger: ILogger, runnerConfig: YaitdeRunnerConfig, environment: any) {
        this._logger = logger;
        this._environment = environment;
        this._runnerConfig = runnerConfig;
    }

    getRepoPath(): string {
        return repoPathFromEnvironment(this._environment);
    }
    
    public async run(testId: string): Promise<IRunnerResult> {
        const params = [ this._runnerConfig.path, "-i", testId];
        const result = await this.runProcess("ts-node", params)
        return { status: "??", result : JSON.parse(result) };
    }

    private async runProcess(processName: string, params: string[]): Promise<string> {
        try {
            const task = spawn(processName, params)
            const result = await task;
            return result.toString();
        } catch (e) {
            this._logger.error(e);
            throw new Error(`error executing ${processName} ${JSON.stringify(params)}`);
        }
    }
}